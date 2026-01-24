# Icons & Assets à Créer pour Bunshin3D

## Liste des Fichiers Requis

| Nom du fichier | Format | Dimensions (px) | Usage principal |
|----------------|--------|-----------------|-----------------|
| `favicon.ico` | ICO | 32x32 | Navigateurs anciens, PC standard |
| `icon-16x16.png` | PNG | 16x16 | Petit favicon d'onglet (écrans non-retina) |
| `icon-32x32.png` | PNG | 32x32 | Favicon d'onglet standard (écrans retina) |
| `apple-touch-icon.png` | PNG | 180x180 | Icône écran d'accueil iPhone/iPad |
| `icon-192.png` | PNG | 192x192 | PWA Android (écran d'accueil) |
| `icon-512.png` | PNG | 512x512 | PWA Android (splash screen, store) |
| `mstile-150x150.png` | PNG | 150x150 | Tuile Windows 10/11 (Menu démarrer) |
| `safari-pinned-tab.svg` | SVG | Vectoriel | Onglet épinglé Safari (monochrome) |
| `og-image.jpg` | JPG | 1200x630 | Open Graph / Social Media Share |

## Recommandations Design

### Logo/Icon
- **Couleurs**: Purple-blue gradient (brand colors)
- **Symbole**: Sparkles ✨ ou "B3D" stylisé
- **Style**: Moderne, tech, minimaliste
- **Fond**: Transparent pour PNG, ou gradient sombre

### OG Image (1200x630)
- **Contenu**: Logo Bunshin3D + slogan "Transform Images to 3D with AI"
- **Couleurs**: Brand gradient (purple-blue)
- **Style**: Professional, eye-catching
- **Format**: JPG optimisé (< 300KB)

### Safari Pinned Tab (SVG)
- **Important**: DOIT être monochrome (une seule couleur)
- **Forme**: Contour simple du logo
- **Fond**: Transparent
- **Couleur**: Noir (#000000)

## Emplacement
Tous les fichiers doivent être placés dans le dossier `/public/` à la racine du projet.

## Validation
- Tester avec https://realfavicongenerator.net/
- Vérifier OG image avec https://www.opengraph.xyz/
- Tester PWA avec Lighthouse
