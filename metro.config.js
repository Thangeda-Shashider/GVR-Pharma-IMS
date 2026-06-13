// metro.config.js
// Fix for Firebase 10.x "Component auth has not been registered yet" error.
// Metro's new package exports resolver picks the wrong Firebase bundle
// (Node.js/server version instead of React Native version).
// Setting unstable_enablePackageExports = false forces Metro to use the
// 'main' field instead of 'exports', which resolves to the correct bundle.

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable package exports resolution — required for Firebase 10.x compatibility
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
