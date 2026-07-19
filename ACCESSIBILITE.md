# Accessibilité — Frontend SBL

Le frontend vise la conformité au **RGAA 4** et aux bonnes pratiques
**OPQUAST**. L'accessibilité est vérifiée en continu par le linter
`eslint-plugin-vuejs-accessibility` (intégré à la CI).

## Mesures en place

| Critère (RGAA / OPQUAST) | Mesure |
| --- | --- |
| Langue de la page (RGAA 8.3) | `<html lang="fr">` |
| Titre & description (OPQUAST) | `<title>` explicite + `<meta name="description">` |
| Structure / landmarks (RGAA 9, 12) | `<header>`, `<nav aria-label>`, `<main id="main-content">` |
| Lien d'évitement (RGAA 12.7) | « Aller au contenu principal » visible au focus clavier |
| Liens explicites (RGAA 6.1) | `aria-label` sur les liens icônes (Discord, X) et le logo |
| Images de décoration (RGAA 1.2) | Icônes purement décoratives marquées `aria-hidden="true"` |
| Images porteuses de sens (RGAA 1.1) | Logo exposé via `role="img"` + `aria-label` |
| Liens externes (OPQUAST) | Nouvel onglet signalé dans le libellé + `rel="noopener noreferrer"` |
| Navigation clavier | Focus géré, styles de focus conservés |

## Vérification

- **Automatique (CI)** : `npm run lint` applique les règles
  `vuejs-accessibility/*` sur tous les templates.
- **Manuelle recommandée** : navigation complète au clavier, test avec un
  lecteur d'écran (NVDA / VoiceOver), audit Lighthouse / axe DevTools, contrôle
  des contrastes de couleurs.

## Points d'attention restants

- Vérifier les contrastes de la charte (texte blanc sur dégradé violet).
- Ajouter des `alt` pertinents si des balises `<img>` sont introduites.
- Associer libellés et champs si des formulaires sont ajoutés.
