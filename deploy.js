#!/usr/bin/env node

/**
 * Deployment Script - Minifies and obfuscates code for production
 * This removes comments, minifies JS, and makes code harder to read
 */

const fs = require('fs');
const path = require('path');

// Minification function for JavaScript
function minifyJS(code) {
    return code
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove unnecessary spaces around operators
        .replace(/\s*([{}();,:])\s*/g, '$1')
        // Remove leading/trailing spaces
        .trim();
}

// Simple variable name obfuscation
function obfuscateJS(code) {
    const varMap = new Map();
    let counter = 0;
    
    // Generate short variable names
    const generateVarName = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let name = '';
        let num = counter++;
        do {
            name = chars[num % 26] + name;
            num = Math.floor(num / 26);
        } while (num > 0);
        return '_' + name;
    };
    
    // Replace common class and function names
    const replacements = {
        'AppState': generateVarName(),
        'StorageManager': generateVarName(),
        'MockAPI': generateVarName(),
        'Utils': generateVarName(),
        'ChartHelper': generateVarName(),
        'ROIConfig': generateVarName(),
        'updateTime': generateVarName(),
        'applyEnhancedStyles': generateVarName()
    };
    
    let obfuscated = code;
    for (const [original, replacement] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        obfuscated = obfuscated.replace(regex, replacement);
    }
    
    return obfuscated;
}

// Process JavaScript files
function processJSFile(filePath, outputPath) {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove documentation comments
    content = content.replace(/\/\*\*[\s\S]*?\*\//g, '');
    
    // Minify and obfuscate
    content = minifyJS(content);
    content = obfuscateJS(content);
    
    // Write to output
    fs.writeFileSync(outputPath, content);
    console.log(`✓ Minified and obfuscated: ${outputPath}`);
}

// Process HTML files - minify and remove comments
function processHTMLFile(filePath, outputPath) {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');
    
    // Minify inline JavaScript
    content = content.replace(/<script>([\s\S]*?)<\/script>/g, (match, js) => {
        const minified = minifyJS(js);
        return `<script>${minified}</script>`;
    });
    
    // Remove extra whitespace
    content = content.replace(/>\s+</g, '><');
    
    fs.writeFileSync(outputPath, content);
    console.log(`✓ Minified HTML: ${outputPath}`);
}

// Main deployment function
function deploy() {
    console.log('🚀 Starting deployment process...\n');
    
    // Create dist directory
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    
    if (!fs.existsSync('dist/js')) {
        fs.mkdirSync('dist/js');
    }
    
    // Process JavaScript files
    if (fs.existsSync('js/shared.js')) {
        processJSFile('js/shared.js', 'dist/js/shared.js');
    }
    
    // Process HTML files
    const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
    htmlFiles.forEach(file => {
        processHTMLFile(file, `dist/${file}`);
    });
    
    // Copy static assets
    if (fs.existsSync('logo.png')) {
        fs.copyFileSync('logo.png', 'dist/logo.png');
        console.log('✓ Copied logo.png');
    }
    
    // Create index file that redirects to dashboard
    const indexContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=dashboard.html"></head>
<body><p>Redirecting to dashboard...</p></body></html>`;
    fs.writeFileSync('dist/index.html', indexContent);
    
    console.log('\n✅ Deployment build complete!');
    console.log('📁 Files are ready in the dist/ folder');
    console.log('🌐 You can now deploy the dist/ folder to any hosting service');
}

// Run deployment
deploy();
