const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for web polyfills
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  crypto: 'crypto-browserify',
  stream: 'stream-browserify',
  buffer: 'buffer',
  process: 'process/browser',
};

// Add support for additional asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'json'
];

// Ensure platforms are properly defined
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

module.exports = config; 