---
description: How to deploy the application to GitHub Pages
---

# Deploying to GitHub Pages

This project is configured to deploy to GitHub Pages at `https://roma321m.github.io/shavtzak/`.

## Prerequisites
1.  Ensure your changes are committed and pushed to your GitHub repository.
    ```powershell
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

## Deployment Steps
1.  Run the deployment script:
    ```powershell
    npm run deploy
    ```
    This command will:
    - Build the project (creates a `dist` folder).
    - Push the `dist` folder to the `gh-pages` branch of your repository.

2.  **First Time Only**:
    - Go to your repository settings on GitHub: [https://github.com/roma321m/shavtzak/settings/pages](https://github.com/roma321m/shavtzak/settings/pages)
    - Ensure "Source" is set to "Deploy from a branch".
    - Select the `gh-pages` branch and `/ (root)` folder.
    - Click "Save".

3.  Wait a few minutes for the action to complete. Your site will be live at:
    **https://roma321m.github.io/shavtzak/**
