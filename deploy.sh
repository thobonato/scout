#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting deployment process..."

# Update development branch
echo "Updating development branch..."
git switch development
git pull
echo "Development branch updated successfully!"

# Update main branch
echo "Updating and rebasing main branch..."
git switch main
git pull
git rebase development
git push --force-with-lease
echo "Main branch updated and pushed successfully!"

# Return to development branch
git switch development
echo "Returned to development branch"
