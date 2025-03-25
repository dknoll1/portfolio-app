#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Check for required environment variables
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const email = process.env.CLOUDFLARE_EMAIL;
const apiKey = process.env.CLOUDFLARE_API_KEY;

if (!accountId) {
  console.error('Error: CLOUDFLARE_ACCOUNT_ID is not set in .env.local');
  process.exit(1);
}

// Check authentication method
if (!apiToken && (!email || !apiKey)) {
  console.error('Error: You must provide either:');
  console.error('  - CLOUDFLARE_API_TOKEN (recommended)');
  console.error('  - or both CLOUDFLARE_EMAIL and CLOUDFLARE_API_KEY');
  process.exit(1);
}

// Ensure wrangler is installed
try {
  execSync('wrangler --version', { stdio: 'ignore' });
  console.log('✓ Wrangler is installed');
} catch (error) {
  console.log('Installing wrangler globally...');
  execSync('npm install -g wrangler', { stdio: 'inherit' });
}

// Ensure @cloudflare/workers-types is installed
try {
  require.resolve('@cloudflare/workers-types');
  console.log('✓ @cloudflare/workers-types is installed');
} catch (error) {
  console.log('Installing @cloudflare/workers-types...');
  execSync('npm install --save-dev @cloudflare/workers-types', { stdio: 'inherit' });
}

// Ensure dotenv is installed
try {
  require.resolve('dotenv');
  console.log('✓ dotenv is installed');
} catch (error) {
  console.log('Installing dotenv...');
  execSync('npm install --save-dev dotenv', { stdio: 'inherit' });
}

// Generate a temporary wrangler config file with account ID
const tempConfigPath = path.join(__dirname, 'wrangler.temp.toml');
const originalConfig = fs.readFileSync(path.join(__dirname, 'wrangler.toml'), 'utf8');
const updatedConfig = originalConfig.replace(/account_id = ".*"/, `account_id = "${accountId}"`);
fs.writeFileSync(tempConfigPath, updatedConfig);

console.log('Deploying worker with Durable Objects...');

try {
  // Set environment variables for wrangler
  const env = { ...process.env };
  if (apiToken) {
    env.CLOUDFLARE_API_TOKEN = apiToken;
  } else {
    env.CLOUDFLARE_EMAIL = email;
    env.CLOUDFLARE_API_KEY = apiKey;
  }

  // Deploy the worker using the newer 'deploy' command
  console.log('Deploying worker and creating Durable Objects...');
  execSync(
    'wrangler deploy --config wrangler.temp.toml src/worker.ts',
    { 
      stdio: 'inherit',
      env
    }
  );
  console.log('✓ Worker deployed successfully with Durable Objects!');
} catch (error) {
  console.error('Failed to deploy worker:', error.message);
  if (error.message.includes('missing metadata')) {
    console.error('\nPossible solution: Make sure Durable Objects is enabled on your Cloudflare account.');
    console.error('Visit https://developers.cloudflare.com/durable-objects/get-started/ for more information.');
  }
  if (error.message.includes('unauthorized')) {
    console.error('\nAuthentication error: Check that your API token or Global API key is correct and has the proper permissions.');
    console.error('Required permissions: Account > Workers Scripts > Edit, Account > Workers Routes > Edit, Account > Durable Objects > Edit');
  }
} finally {
  // Clean up temporary file
  if (fs.existsSync(tempConfigPath)) {
    fs.unlinkSync(tempConfigPath);
  }
}

console.log('\nYou can now access the IRC chat in your portfolio app!');
console.log('If you encounter issues:');
console.log('1. Check that your Cloudflare account has Durable Objects enabled');
console.log('2. Verify your API token/key has sufficient permissions');
console.log('3. Ensure you\'re connected to the internet when accessing the chat feature'); 