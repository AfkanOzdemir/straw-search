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