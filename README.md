# Nafa+ : Le Compte Clair

Créer une application mobile (Web App progressive) de gestion commerciale et d'inclusion financière pour les micro-commerçants d'Afrique de l'Ouest, nommée 'Nafa+'. L'identité visuelle est primordiale.

1. Identité Visuelle et Charte Graphique

Couleurs de Marque (Hexadécimal) :

Couleur Primaire (Vert Profond) : #0E5A3C (Stabilité financière, croissance, secteur formel/informel).

Couleur de Soulignement (Or) : #F2B705 (Réussite, gain, dynamisme).

Fond de Page : Blanc cassé très clair ou vert très pâle pour la clarté.

Logo :

Utiliser le logo combinant un Bouclier (sécurité/confiance), une Boutique (commerce de proximité) et une Flèche montante (profit/croissance). Le tout dans le coloris vert profond avec des touches or.

Typographie :

Police moderne, épurée et sans empattement (ex: Poppins, Inter) pour une lisibilité maximale.

2. Architecture de l'Application et Écrans Clés

Concevoir une Web App Web View (mobile-first), réactive et légère.

Écran 1 : Authentification / Splash Screen (Simplifié)

Logo Nafa+ centré, avec le slogan "Ton business, plus de profit."

Saisie simplifiée (ex: numéro de téléphone ou reconnaissance faciale facultative) pour une adoption rapide.

Écran 2 : Tableau de Bord / Dashboard (Basé sur Fadoul Capital)

L'interface de l'application (ici logotypée sous l'entité Fadoul Capital), doit inclure plusieurs détails montrent que tu as compris les irritants majeurs du secteur :

En-tête : "Bonjour, Adama 👋" (ou nom utilisateur). Un Dashboard clair et immédiat.

Action Principale (Bouton central) : "Nouvelle Vente" (Vert Profond, texte or), avec une icône de vocal (onde sonore) pour dictée rapide.

Les Chiffres Clés (Cards) :

FCFA 12 450 (Ventes d'Aujourd'hui)

FCFA 38 750 (Bénéfice Net) - Mettre l'accent sur le bénéfice.

FCFA 22 000 (Créances Clients)

FCFA 3 500 (Total Dettes)

Section Stocks : Afficher une Card "Alertes Stock Faible" listant les produits critiques (ex: Lait concentré, Sucre).

Écran 3 : Le Score de Confiance (Fonctionnalité Maîtresse)

Cette fonctionnalité maîtresse, gamifie la bonne gestion (enregistrer ses ventes, régler ses dettes à temps) sous forme de jauge incitative. Le commerçant comprend tout de suite que s'il passe au vert, il débloque son "passeport financier" pour obtenir du crédit ou de meilleures offres fournisseurs.

Afficher une Jauge (Score Dial) semi-circulaire (inspirée de la capture).

Score actuel : 760/1000.

Label de niveau : Bon (texte or).

Texte incitatif : "Ton business est fiable. Tu es éligible à FCFA 250 000 de stock à crédit !"

Bouton d'appel à l'action : "Demander Stock à Crédit".

Écran 4 : Suivi des Dettes Clients (Humain et Clair)

Cette page de suivi des dettes avec les visages et les noms des clients (Moussa, Awa, Issa...) rend l'outil humain. Le bouton rouge pour les montants dus rappelle subtilement l'urgence sans être agressif, idéal pour suivre le recouvrement.

Titre : "Suivi des Dettes Clients"

Filtre/Tri : Par montant le plus élevé.

Liste de Contacts (Cards détaillées) :

Photo/Nom : "Moussa Traoré"

Montant dû : FCFA 45 000 (Texte rouge subtil).

Dernière vente : "2 juin 2026".

Actions :

Icône Vocal (dictée de relance vocale).

Icône SMS (relance automatique par message court et clair).

Écran 5 : Gestion des Produits / Inventaire

Liste claire avec des icônes de produits de l'informel (savon, riz, huile, boîtes de conserve).

Utiliser les fiches produits détaillées (comme "Savon Citronné BF" de la capture), incluant la saisie vocale (icône micro) pour l'ajout rapide et la modification.

3. Interactions et Logique Applicative

Saisie Vocale Partout : L'icône de recherche/saisie vocale sur l'écran de vente. Une onde sonore à côté de "Nouvelle vente". Pour un commerçant pressé au marché central de Bobo ou qui n'est pas totalement à l'aise avec la saisie au clavier, pouvoir dicter sa vente ou sa dette est un facteur d'adoption massif.

Nouvelle Vente, Création de Dette, Ajout de Produit.

Un commerçant pressé ou moins à l'aise avec le clavier doit pouvoir dicter ses actions.

Logique du Score : Le score augmente avec chaque vente enregistrée et chaque dette remboursée par le client.

Fonctionnalité Hors-ligne (PWA) : L'application fonctionne même sans connexion (hors-ligne). Elle se synchronise uniquement quand vous êtes connecté au Wi-Fi ou quand vous le décidez. L'application doit gérer le stockage local pour permettre la saisie au marché sans connexion internet.

Relances Automatiques par SMS : Un clic sur l'icône SMS d'une dette envoie un message pré-rempli (personnalisable par l'utilisateur).

4. Modèle Économique : Partenariat Grossistes (Stratégie Top-Down)

Le modèle économique intègre directement le concept de stock à crédit issu de la relation avec les grossistes. S'attaquer d'abord aux grossistes et aux demi-grossistes donne un effet de levier massif. En convainquant "les boss" du marché, l'application ne gagne pas seulement des clients individuels, mais achète une crédibilité immédiate et intègre tout leur réseau de distribution.

Stratégie Top-Down / Top-Down : Digitaliser en priorité les grossistes d'alimentation générale pour forcer l'adoption descendante.

L'effet d'autorité (Le parrainage)

Le contrôle du nœud du problème (Crédits descendants)

Dashboard Grossiste Spécifique : Un écran permettant au grossiste de voir en un clin d'œil qui lui doit quoi (ex: Moussa Traoré : 45 000 FCFA, Awa Diallo : 32 500 FCFA), et d'envoyer des rappels groupés en un clic (comme l'écran "Dettes clients" de l'interface 561324.png).

5. Résumé de la Proposition de Valeur

En résumé, l'application Nafa+ combine une identité visuelle puissante et une expérience utilisateur taillée pour le commerçant de l'informel. Elle matérialise la promesse du Crédit via le Score de confiance et l'argument "Sécurisé, tes données sont protégées".

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nafa-plus-grow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/792f56a2-d9d3-4585-8aab-562dee27086b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
