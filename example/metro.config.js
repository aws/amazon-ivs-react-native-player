const path = require('path');
const escape = require('escape-string-regexp');
const pak = require('../package.json');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { blockList: defaultBlockList },
} = defaultConfig;

const modules = [
  '@babel/runtime',
  ...Object.keys({
    ...pak.peerDependencies,
  }),
];

const modulesToBlock = modules.map(
  (m) =>
    new RegExp(
      // Use OS-agnostic path separator ([\/\\]) as recommended
      `^${escape(path.join(root, 'node_modules', m))}[\\/\\\\].*$`
    )
);

const config = {
  projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we blockList them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blockList: modulesToBlock.concat(defaultBlockList || []),
    extraNodeModules: modules.reduce(
      (acc, name) => {
        acc[name] = path.join(__dirname, 'node_modules', name);
        return acc;
      },
      {
        'amazon-ivs-react-native-player': root,
      }
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
