# Deployment Guide

## 🚀 Quick Deploy

### Option 1: GitHub Pages (Recommended)
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as source
4. The workflow will automatically build and deploy

### Option 2: Manual Build
```bash
# Build the project
node deploy.js

# The built files will be in the dist/ folder
# Upload the dist/ folder to any hosting service
```

### Option 3: Other Hosting Platforms

#### Netlify
1. Build locally: `node deploy.js`
2. Drag and drop the `dist/` folder to Netlify

#### Vercel
1. Build locally: `node deploy.js`
2. Run `vercel --prod` in the `dist/` folder

#### Traditional Web Hosting
1. Build locally: `node deploy.js`
2. Upload contents of `dist/` folder via FTP/SFTP

## 🔒 Code Protection Features

The deployment script automatically:
- **Minifies** all JavaScript and HTML files
- **Removes** all comments and documentation
- **Obfuscates** variable and function names
- **Compresses** whitespace and formatting
- **Strips** debug information

## 📁 Deployment Structure

```
dist/
├── index.html          # Auto-redirects to dashboard
├── dashboard.html      # Main application entry
├── *.html             # All other pages (minified)
├── js/shared.js       # Minified and obfuscated JavaScript
└── logo.png          # Static assets
```

## 🌐 Live URL

After deployment, your dashboard will be accessible at:
- GitHub Pages: `https://username.github.io/repository-name`
- Custom domain: Configure in hosting platform settings

## 🔧 Development vs Production

- **Development**: Work with original source files
- **Production**: Only the `dist/` folder is deployed
- **Source Protection**: Original code remains private in your repository

## 📊 What's Deployed

✅ **Included in public deployment:**
- Minified HTML pages
- Obfuscated JavaScript
- Compressed assets
- Production-ready application

❌ **NOT included in public deployment:**
- Source code comments
- Development files
- Original formatting
- Debug information
- Build scripts
