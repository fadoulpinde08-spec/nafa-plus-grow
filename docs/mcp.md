# Nafa+ — Documentation du serveur MCP

Le serveur MCP de Nafa+ expose les données commerciales de l'app (produits, ventes, créances clients) à un agent IA (Claude, ChatGPT, Cursor, Lovable…).

- **Endpoint** : `https://<votre-domaine>/mcp`
- **Transport** : MCP Streamable HTTP (POST JSON-RPC 2.0)
- **Authentification** : aucune (serveur public — toute personne connaissant l'URL peut lire **et modifier** les produits, ventes et créances)
- **Nom du serveur** : `nafa-plus-mcp` — version `0.1.0`
- **Devise** : toutes les valeurs monétaires sont en **FCFA**

> Les données sont actuellement stockées en mémoire côté serveur (jeu de démonstration). Elles sont réinitialisées à chaque redéploiement.

## Connexion d'un client

Configuration type (`mcp.json` / Claude Desktop / Cursor) :

```json
{
  "mcpServers": {
    "nafa-plus": {
      "url": "https://<votre-domaine>/mcp"
    }
  }
}
```

Appel HTTP brut — les deux en-têtes ci-dessous sont obligatoires :

```bash
curl -X POST https://<votre-domaine>/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Un appel d'outil suit toujours cette forme :

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": { "name": "<nom_outil>", "arguments": { } }
}
```

Chaque réponse contient `content` (texte lisible) et, sauf mention contraire, `structuredContent` (JSON exploitable). En cas d'erreur métier (produit introuvable, stock insuffisant…), l'outil renvoie un résultat d'erreur avec un message en français.

---

## Outils en lecture

### `list_products` — Lister l'inventaire

| Entrée | Type | Requis | Description |
| --- | --- | --- | --- |
| `status` | `"ok" \| "low" \| "out"` | non | Filtre par état de stock (`low` = 10 ou moins, `out` = 0) |

**Sortie** : `{ products: Product[] }`

`Product` : `{ id, name, price, stock, unit, emoji, status }`

```json
{ "name": "list_products", "arguments": { "status": "low" } }
```

```json
{
  "products": [
    { "id": "p3", "name": "Sucre 1kg", "price": 750, "stock": 4, "unit": "pcs", "emoji": "🧂", "status": "low" }
  ]
}
```

### `list_customer_debts` — Lister les créances clients

| Entrée | Type | Requis | Description |
| --- | --- | --- | --- |
| `minAmount` | `number ≥ 0` | non | Ne retourne que les créances supérieures ou égales à ce montant (FCFA) |

**Sortie** : `{ debts: Debt[], total: number, currency: "FCFA" }`

`Debt` : `{ id, name, initials, amount, lastSale, phone }`

```json
{ "name": "list_customer_debts", "arguments": { "minAmount": 20000 } }
```

```json
{
  "debts": [
    { "id": "d1", "name": "Moussa Traoré", "initials": "MT", "amount": 45000, "lastSale": "12 août 2026", "phone": "+226 70 00 00 00" }
  ],
  "total": 45000,
  "currency": "FCFA"
}
```

### `sales_summary` — Synthèse ventes & stock

Aucun paramètre.

**Sortie** :

```json
{
  "currency": "FCFA",
  "recordedSales": 3,
  "today": { "sales": 12450, "netProfit": 38750, "transactions": 24, "vsYesterdayPct": 12 },
  "month": { "sales": 1245000, "netProfit": 312400, "vsPreviousMonthPct": 18 },
  "trustScore": { "value": 760, "max": 1000, "creditEligibleFCFA": 250000 },
  "lowStock": [{ "id": "p3", "name": "Sucre 1kg", "stock": 4, "status": "low" }]
}
```

`recordedSales` compte les ventes créées via `create_sale` ; les KPIs `today`/`month`/`trustScore` proviennent du jeu de démonstration.

---

## Outils en écriture

### `create_sale` — Enregistrer une vente

Décrémente le stock des produits vendus et, en cas de paiement à crédit, crée ou augmente la créance du client.

| Entrée | Type | Requis | Description |
| --- | --- | --- | --- |
| `items` | `{ productId: string, qty: entier > 0 }[]` (min. 1) | oui | Lignes de vente |
| `paymentMethod` | `"cash" \| "mobile_money" \| "credit"` | non (défaut `cash`) | Mode de règlement |
| `customer` | `string` | oui si `credit` | Nom du client |

**Sortie** : `{ sale: Sale, currency: "FCFA" }` où `Sale` = `{ id, createdAt, items: [{ productId, name, qty, unitPrice }], total, paymentMethod, customer? }`

```json
{
  "name": "create_sale",
  "arguments": {
    "items": [{ "productId": "p1", "qty": 2 }, { "productId": "p2", "qty": 1 }],
    "paymentMethod": "credit",
    "customer": "Moussa Traoré"
  }
}
```

**Erreurs** : `Produit introuvable: <id>` · `Stock insuffisant pour <produit> (<n> restant).` · `Un nom de client est requis pour une vente à crédit.`

### `add_product` — Ajouter ou réapprovisionner un produit

Si un produit porte déjà le même nom (insensible à la casse), son stock est augmenté et son prix mis à jour ; sinon un nouveau produit est créé.

| Entrée | Type | Requis | Description |
| --- | --- | --- | --- |
| `name` | `string` non vide | oui | Nom du produit |
| `price` | `number > 0` | oui | Prix unitaire en FCFA |
| `stock` | `entier ≥ 0` | non (défaut `0`) | Quantité à ajouter |
| `unit` | `string` | non (défaut `pcs`) | Unité (`kg`, `L`, `pcs`…) |
| `emoji` | `string` | non (défaut `📦`) | Emoji affiché dans l'inventaire |

**Sortie** : `{ product: Product, created: boolean }` — `created: false` signifie réapprovisionnement.

```json
{
  "name": "add_product",
  "arguments": { "name": "Riz parfumé 5kg", "price": 4500, "stock": 20, "unit": "sac", "emoji": "🍚" }
}
```

**Erreurs** : `Le prix doit être supérieur à 0.`

### `mark_debt_paid` — Enregistrer un remboursement

Outil destructif : la créance est réduite, et supprimée dès qu'elle atteint 0.

| Entrée | Type | Requis | Description |
| --- | --- | --- | --- |
| `customer` | `string` non vide | oui | Nom du client **ou** identifiant de la créance |
| `amount` | `number > 0` | non | Montant remboursé ; omis = solde total |

**Sortie** : `{ customer, paid, remaining, settled, currency: "FCFA" }`

```json
{ "name": "mark_debt_paid", "arguments": { "customer": "Moussa Traoré", "amount": 15000 } }
```

```json
{ "customer": "Moussa Traoré", "paid": 15000, "remaining": 30000, "settled": false, "currency": "FCFA" }
```

**Erreurs** : `Aucune créance trouvée pour "<nom>".` · `Le montant dépasse la créance de <client> (<n> FCFA).`

---

## Bonnes pratiques d'intégration

1. Appeler `list_products` avant `create_sale` pour récupérer les `productId` réels.
2. Vérifier `structuredContent` plutôt que de parser le texte.
3. Traiter `mark_debt_paid` et `create_sale` comme non idempotents : ne pas rejouer un appel après un timeout sans vérifier d'abord via `list_customer_debts` / `sales_summary`.
4. Ne pas exposer publiquement l'URL du serveur tant qu'aucune authentification n'est en place.