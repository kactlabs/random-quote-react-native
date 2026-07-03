const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const defaultPolyfills = require('react-native/rn-get-polyfills');

config.serializer = {
  ...config.serializer,
  getPolyfills: () => {
    return [
      path.resolve(__dirname, 'global.js'),
      ...defaultPolyfills(),
    ];
  },
};

module.exports = config;
