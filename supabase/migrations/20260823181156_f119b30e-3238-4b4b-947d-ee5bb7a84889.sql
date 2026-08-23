CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  shop_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock NUMERIC(12,2) NOT NULL DEFAULT 0,
  low_stock_threshold NUMERIC(12,2) NOT NULL DEFAULT 10,
  unit TEXT NOT NULL DEFAULT 'pcs',
  emoji TEXT NOT NULL DEFAULT '📦',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX products_user_idx ON public.products(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own products" ON public.products FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX customers_user_idx ON public.customers(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own customers" ON public.customers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers ON DELETE SET NULL,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','mobile_money','credit')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX sales_user_created_idx ON public.sales(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sales" ON public.sales FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  sale_id UUID NOT NULL REFERENCES public.sales ON DELETE CASCADE,
  product_id UUID REFERENCES public.products ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  qty NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX sale_items_sale_idx ON public.sale_items(sale_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_items TO authenticated;
GRANT ALL ON public.sale_items TO service_role;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sale items" ON public.sale_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.debt_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  method TEXT NOT NULL DEFAULT 'cash' CHECK (method IN ('cash','mobile_money')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX debt_payments_customer_idx ON public.debt_payments(customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debt_payments TO authenticated;
GRANT ALL ON public.debt_payments TO service_role;
ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own debt payments" ON public.debt_payments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, shop_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'shop_name', ''),
    NEW.raw_user_meta_data ->> 'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.record_sale(
  p_items JSONB,
  p_payment_method TEXT,
  p_customer_name TEXT DEFAULT NULL,
  p_customer_phone TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_customer UUID;
  v_sale UUID;
  v_item JSONB;
  v_product public.products%ROWTYPE;
  v_qty NUMERIC;
  v_total NUMERIC := 0;
  v_cost NUMERIC := 0;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Non authentifié'; END IF;
  IF p_payment_method NOT IN ('cash','mobile_money','credit') THEN RAISE EXCEPTION 'Mode de paiement invalide'; END IF;
  IF p_payment_method = 'credit' AND COALESCE(TRIM(p_customer_name), '') = '' THEN
    RAISE EXCEPTION 'Un nom de client est requis pour une vente à crédit';
  END IF;

  IF COALESCE(TRIM(p_customer_name), '') <> '' THEN
    SELECT id INTO v_customer FROM public.customers
      WHERE user_id = v_user AND lower(name) = lower(TRIM(p_customer_name)) LIMIT 1;
    IF v_customer IS NULL THEN
      INSERT INTO public.customers (user_id, name, phone) VALUES (v_user, TRIM(p_customer_name), p_customer_phone)
      RETURNING id INTO v_customer;
    ELSIF p_customer_phone IS NOT NULL THEN
      UPDATE public.customers SET phone = p_customer_phone WHERE id = v_customer;
    END IF;
  END IF;

  INSERT INTO public.sales (user_id, customer_id, total, cost_total, payment_method, note)
  VALUES (v_user, v_customer, 0, 0, p_payment_method, p_note) RETURNING id INTO v_sale;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := (v_item ->> 'qty')::NUMERIC;
    IF v_qty IS NULL OR v_qty <= 0 THEN RAISE EXCEPTION 'Quantité invalide'; END IF;
    SELECT * INTO v_product FROM public.products
      WHERE id = (v_item ->> 'product_id')::UUID AND user_id = v_user FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Produit introuvable'; END IF;
    IF v_product.stock < v_qty THEN
      RAISE EXCEPTION 'Stock insuffisant pour %', v_product.name;
    END IF;
    UPDATE public.products SET stock = stock - v_qty WHERE id = v_product.id;
    INSERT INTO public.sale_items (user_id, sale_id, product_id, product_name, qty, unit_price, unit_cost)
    VALUES (v_user, v_sale, v_product.id, v_product.name, v_qty, v_product.price, v_product.cost);
    v_total := v_total + v_qty * v_product.price;
    v_cost := v_cost + v_qty * v_product.cost;
  END LOOP;

  IF v_total = 0 THEN RAISE EXCEPTION 'Panier vide'; END IF;
  UPDATE public.sales SET total = v_total, cost_total = v_cost WHERE id = v_sale;
  RETURN v_sale;
END; $$;
GRANT EXECUTE ON FUNCTION public.record_sale(JSONB, TEXT, TEXT, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE VIEW public.customer_balances
WITH (security_invoker = true) AS
SELECT
  c.id,
  c.user_id,
  c.name,
  c.phone,
  c.photo_url,
  COALESCE((SELECT SUM(s.total) FROM public.sales s WHERE s.customer_id = c.id AND s.payment_method = 'credit'), 0)
    - COALESCE((SELECT SUM(p.amount) FROM public.debt_payments p WHERE p.customer_id = c.id), 0) AS balance,
  (SELECT MAX(s.created_at) FROM public.sales s WHERE s.customer_id = c.id) AS last_sale_at
FROM public.customers c;
GRANT SELECT ON public.customer_balances TO authenticated;