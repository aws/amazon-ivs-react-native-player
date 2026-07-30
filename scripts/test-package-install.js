const assert = require('node:assert/strict');
const crossSpawn = require('cross-spawn');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const packageRoot = path.resolve(__dirname, '..');
const sourceManifestPath = path.join(packageRoot, 'package.json');
const sourceManifestText = fs.readFileSync(sourceManifestPath, 'utf8');
const sourceManifest = JSON.parse(sourceManifestText);
const tempRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), 'amazon-ivs-package-install-')
);

function run(command, args, options) {
  return crossSpawn.sync(command, args, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });
}

function commandOutput(result) {
  return [
    `status: ${result.status}`,
    `signal: ${result.signal}`,
    `stdout:\n${result.stdout || ''}`,
    `stderr:\n${result.stderr || ''}`,
  ].join('\n');
}

function assertCommandStarted(result, description) {
  assert.equal(
    result.error == null,
    true,
    `${description} could not start: ${result.error}`
  );
  assert.equal(
    result.signal,
    null,
    `${description} was terminated by ${result.signal}\n${commandOutput(
      result
    )}`
  );
}

try {
  assert.equal(
    sourceManifest.scripts.postinstall,
    'husky',
    'the source manifest must keep installing contributor Git hooks'
  );
  assert.equal(
    sourceManifest.scripts._postinstall,
    undefined,
    'the source manifest started with a disabled postinstall script'
  );

  const tarballPath = path.join(tempRoot, 'amazon-ivs-react-native-player.tgz');
  const packResult = run('corepack', ['yarn', 'pack', '--out', tarballPath], {
    cwd: packageRoot,
  });

  assertCommandStarted(packResult, 'yarn pack');
  assert.equal(
    packResult.status,
    0,
    `yarn pack failed\n${commandOutput(packResult)}`
  );
  assert.ok(
    fs.statSync(tarballPath).size > 0,
    'yarn pack created an empty archive'
  );

  const restoredManifest = JSON.parse(
    fs.readFileSync(sourceManifestPath, 'utf8')
  );
  assert.equal(
    restoredManifest.scripts.postinstall,
    sourceManifest.scripts.postinstall,
    'yarn pack did not restore the source postinstall script'
  );
  assert.equal(
    restoredManifest.scripts._postinstall,
    undefined,
    'yarn pack left a disabled postinstall script in the source manifest'
  );

  const consumerRoot = path.join(tempRoot, 'consumer');
  const cacheRoot = path.join(tempRoot, 'npm-cache');
  const guardBin = path.join(tempRoot, 'guard-bin');
  const guardMarker = path.join(tempRoot, 'husky-called');
  const userConfig = path.join(tempRoot, 'npmrc');

  fs.mkdirSync(consumerRoot);
  fs.mkdirSync(cacheRoot);
  fs.mkdirSync(guardBin);
  fs.writeFileSync(
    path.join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'package-install-smoke-test',
        version: '1.0.0',
        private: true,
      },
      null,
      2
    )}\n`
  );
  fs.writeFileSync(userConfig, '');

  const posixGuard = path.join(guardBin, 'husky');
  fs.writeFileSync(
    posixGuard,
    '#!/bin/sh\n: > "$HUSKY_GUARD_MARKER"\nexit 86\n'
  );
  fs.chmodSync(posixGuard, 0o755);
  fs.writeFileSync(
    path.join(guardBin, 'husky.cmd'),
    '@echo off\r\ntype nul > "%HUSKY_GUARD_MARKER%"\r\nexit /b 86\r\n'
  );

  const pathKey =
    Object.keys(process.env).find((key) => key.toLowerCase() === 'path') ||
    'PATH';
  const installEnvironment = {
    ...process.env,
    HUSKY_GUARD_MARKER: guardMarker,
    npm_config_ignore_scripts: 'false',
    npm_config_update_notifier: 'false',
    npm_config_userconfig: userConfig,
  };
  installEnvironment[pathKey] = `${guardBin}${path.delimiter}${
    process.env[pathKey] || ''
  }`;

  const installResult = run(
    'npm',
    [
      'install',
      '--offline',
      '--legacy-peer-deps',
      '--omit=dev',
      '--no-save',
      '--no-package-lock',
      '--no-audit',
      '--no-fund',
      '--foreground-scripts',
      '--ignore-scripts=false',
      '--cache',
      cacheRoot,
      tarballPath,
    ],
    {
      cwd: consumerRoot,
      env: installEnvironment,
    }
  );

  assertCommandStarted(installResult, 'consumer npm install');
  assert.equal(
    fs.existsSync(guardMarker),
    false,
    `the packed dependency invoked Husky during consumer installation\n${commandOutput(
      installResult
    )}`
  );
  assert.equal(
    installResult.status,
    0,
    `consumer npm install failed\n${commandOutput(installResult)}`
  );

  const installedManifest = JSON.parse(
    fs.readFileSync(
      path.join(
        consumerRoot,
        'node_modules',
        sourceManifest.name,
        'package.json'
      ),
      'utf8'
    )
  );
  assert.equal(installedManifest.name, sourceManifest.name);
  assert.equal(installedManifest.version, sourceManifest.version);
  assert.equal(
    installedManifest.scripts.postinstall,
    undefined,
    'the packed dependency retained an active postinstall script'
  );
} finally {
  if (fs.readFileSync(sourceManifestPath, 'utf8') !== sourceManifestText) {
    fs.writeFileSync(sourceManifestPath, sourceManifestText);
  }
  fs.rmSync(tempRoot, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 100,
  });
}
