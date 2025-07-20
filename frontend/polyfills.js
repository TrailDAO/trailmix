// Polyfills for Node.js globals in browser environment
import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer available globally
global.Buffer = Buffer;
global.process = process;

// Add crypto polyfill if needed
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto-browserify');
}

// Add stream polyfill if needed
if (typeof global.stream === 'undefined') {
  global.stream = require('stream-browserify');
} 