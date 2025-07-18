# 📱 Guide d'installation PWA - Mes Comptes

## 🌐 Étape 1 : Héberger l'application

### Option A : Netlify (Recommandé - Gratuit)
1. Aller sur [netlify.com](https://netlify.com)
2. Créer un compte gratuit
3. Glisser-déposer le dossier `dist` sur Netlify
4. Vous obtenez une URL comme `https://mes-comptes-abc123.netlify.app`

### Option B : Déploiement rapide
```bash
# Dans le dossier gestion-comptes-perso-pwa
npm run build
npx netlify-cli deploy --prod --dir=dist
```

## 📱 Étape 2 : Installation sur téléphone

### Sur iPhone (Safari) :
1. Ouvrir l'URL dans Safari
2. Appuyer sur le bouton "Partager" 📤
3. Défiler et choisir "Sur l'écran d'accueil"
4. Nommer l'app "Mes Comptes"
5. Appuyer sur "Ajouter"

### Sur Android (Chrome) :
1. Ouvrir l'URL dans Chrome
2. Appuyer sur les 3 points ⋮
3. Choisir "Ajouter à l'écran d'accueil"
4. Ou regarder la bannière "Installer l'app"

## ✨ Résultat final :
- 📱 Icône sur votre écran d'accueil
- 🚀 Lance comme une vraie app
- 📶 Fonctionne hors-ligne
- 💾 Sauvegarde/chargement de données JSON

## 🔄 Synchronisation données :
1. **Sauvegarder** : Bouton "Télécharger" → Fichier JSON
2. **Restaurer** : Bouton "Charger" → Sélectionner fichier JSON
3. **Cloud** : Sauvegarder le JSON sur Google Drive/Dropbox