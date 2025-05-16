#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 StrawSearch Build Script');

// Temizlik
console.log('🧹 Cleaning directories...');
try {
  execSync('rm -rf dist bin');
} catch (error) {
  console.error('Error cleaning directories:', error);
}

// TypeScript derleme
console.log('📦 Building TypeScript...');
try {
  execSync('tsc');
} catch (error) {
  console.error('Error building TypeScript:', error);
}

// Vite ile bundle etme
console.log('📦 Building with Vite...');
try {
  execSync('vite build');
} catch (error) {
  console.error('Error building with vite:', error);
}

// Public klasörünün içeriğini dist klasörüne kopyalama
console.log('📦 Copying public assets to dist...');
try {
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Public klasöründeki tüm dosyaları kopyala
  fs.readdirSync(publicDir).forEach(file => {
    const srcPath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${file} to dist folder`);
  });
} catch (error) {
  console.error('Error copying public assets:', error);
}

// CLI dosyasını kopyalama
console.log('📦 Creating CLI binary...');
try {
  if (!fs.existsSync('bin')) {
    fs.mkdirSync('bin');
  }
  
  fs.copyFileSync('src/bin/cli.js', 'bin/cli.js');
  execSync('chmod +x bin/cli.js');
  console.log('✅ CLI binary created!');
} catch (error) {
  console.error('Error creating CLI binary:', error);
}

// Özet
console.log('\n✨ Build complete!');
console.log('📁 Distribution files are in "dist" directory');
console.log('📁 CLI binary is in "bin" directory');
console.log('🖼️ Public assets are copied to dist directory'); 