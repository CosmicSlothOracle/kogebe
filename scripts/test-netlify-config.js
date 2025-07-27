#!/usr/bin/env node

/**
 * Test-Skript für Netlify-Konfiguration
 * Validiert netlify.toml und API-Funktionen
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Netlify Configuration...\n');

// 1. Test netlify.toml
function testNetlifyToml() {
  console.log('📋 Testing netlify.toml...');

  try {
    const tomlPath = path.join(__dirname, '..', 'netlify.toml');
    const tomlContent = fs.readFileSync(tomlPath, 'utf8');

    // Check required sections
    const requiredSections = ['[build]', '[functions]', '[[redirects]]'];
    const missingSections = requiredSections.filter(section => !tomlContent.includes(section));

    if (missingSections.length > 0) {
      console.log('❌ Missing required sections:', missingSections);
      return false;
    }

    // Check API redirects
    if (!tomlContent.includes('/api/*')) {
      console.log('❌ Missing API redirects');
      return false;
    }

    // Check functions directory
    if (!tomlContent.includes('netlify/functions')) {
      console.log('❌ Missing functions directory configuration');
      return false;
    }

    console.log('✅ netlify.toml configuration is valid');
    return true;
  } catch (error) {
    console.log('❌ Error reading netlify.toml:', error.message);
    return false;
  }
}

// 2. Test API Functions
function testApiFunctions() {
  console.log('\n🔧 Testing API Functions...');

  const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');
  const requiredFunctions = ['banners.js', 'events.js', 'participants.js'];

  try {
    const files = fs.readdirSync(functionsDir);
    const missingFunctions = requiredFunctions.filter(func => !files.includes(func));

    if (missingFunctions.length > 0) {
      console.log('❌ Missing functions:', missingFunctions);
      return false;
    }

    console.log('✅ All required API functions found');
    return true;
  } catch (error) {
    console.log('❌ Error reading functions directory:', error.message);
    return false;
  }
}

// 3. Test Admin Files
function testAdminFiles() {
  console.log('\n👤 Testing Admin Files...');

  const docsDir = path.join(__dirname, '..', 'docs');
  const requiredFiles = ['admin.html', 'react-app/index.html'];

  try {
    const missingFiles = requiredFiles.filter(file => {
      const filePath = path.join(docsDir, file);
      return !fs.existsSync(filePath);
    });

    if (missingFiles.length > 0) {
      console.log('❌ Missing admin files:', missingFiles);
      return false;
    }

    console.log('✅ All admin files found');
    return true;
  } catch (error) {
    console.log('❌ Error checking admin files:', error.message);
    return false;
  }
}

// 4. Test Netlify Identity Integration
function testNetlifyIdentity() {
  console.log('\n🔐 Testing Netlify Identity Integration...');

  const docsDir = path.join(__dirname, '..', 'docs');
  const filesToCheck = ['index.html', 'admin.html'];

  try {
    let allValid = true;

    filesToCheck.forEach(file => {
      const filePath = path.join(docsDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');

        if (!content.includes('netlify-identity-widget.js')) {
          console.log(`❌ Missing Netlify Identity widget in ${file}`);
          allValid = false;
        }

        if (!content.includes('netlifyIdentity')) {
          console.log(`❌ Missing Netlify Identity initialization in ${file}`);
          allValid = false;
        }
      }
    });

    if (allValid) {
      console.log('✅ Netlify Identity integration is valid');
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Error checking Netlify Identity:', error.message);
    return false;
  }
}

// Run all tests
function runTests() {
  const tests = [
    testNetlifyToml,
    testApiFunctions,
    testAdminFiles,
    testNetlifyIdentity
  ];

  const results = tests.map(test => test());
  const passed = results.filter(result => result).length;
  const total = results.length;

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed! Netlify configuration is ready.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues above.');
    process.exit(1);
  }
}

runTests();