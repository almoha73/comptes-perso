#!/bin/bash
# Créer des icônes simples avec ImageMagick ou en SVG

# Créer un SVG simple pour l'icône
cat > /home/almoha/Bureau/gestion-comptes-perso-pwa/public/icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0d6efd" rx="64"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" fill="white" text-anchor="middle">💰</text>
</svg>
EOF

# Copier comme icônes PNG (les navigateurs acceptent les SVG aussi)
cp /home/almoha/Bureau/gestion-comptes-perso-pwa/public/icon.svg /home/almoha/Bureau/gestion-comptes-perso-pwa/public/icon-192.png
cp /home/almoha/Bureau/gestion-comptes-perso-pwa/public/icon.svg /home/almoha/Bureau/gestion-comptes-perso-pwa/public/icon-512.png

echo "Icônes créées avec succès"