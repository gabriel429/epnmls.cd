#!/bin/bash

# Script pour pousser le repo vers GitHub
# Usage: bash push-to-github.sh

echo "🚀 Préparation du push vers GitHub..."

# Vérifier que nous sommes dans le bon dossier
if [ ! -d ".git" ]; then
  echo "❌ Erreur: .git non trouvé. Assurez-vous d'être dans le dossier epnmls.cd"
  exit 1
fi

# Vérifier la branche
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Branche actuelle: $BRANCH"

# Afficher le nombre de commits
COMMITS=$(git rev-list --count HEAD)
echo "📊 Commits: $COMMITS"

# Option 1: SSH (Recommandé)
echo ""
echo "✅ Option 1: SSH (Recommandé)"
echo "Si vous avez configure SSH, executez:"
echo "  git remote set-url origin git@github.com:gabriel429/epnmls.cd.git"
echo "  git push -u origin main"

# Option 2: HTTPS Token
echo ""
echo "✅ Option 2: HTTPS Token"
echo "1. Créer un token à: https://github.com/settings/tokens"
echo "2. Exécuter:"
echo "  git push -u origin main"
echo "3. Username: gabriel429"
echo "4. Password: <votre token>"

# Option 3: Git Credential Helper
echo ""
echo "✅ Option 3: Git Credential Helper (Windows)"
echo "  git config --global credential.helper wincred"
echo "  git push -u origin main"

echo ""
echo "ℹ️  Pour rappel:"
echo "  Repository: https://github.com/gabriel429/epnmls.cd"
echo "  Branch: main"
