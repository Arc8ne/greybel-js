#!/usr/bin/env node --no-warnings
import { AnotherAnsiProvider, ColorType } from 'another-ansi';
import { program } from 'commander';
import open from 'open';
import pacote from 'pacote';
import semver from 'semver';

import packageJSON from '../package.json' assert { type: 'json' };

const ansiProvider = new AnotherAnsiProvider();
const engineVersion = packageJSON.engines.node;

if (!semver.satisfies(process.version, engineVersion)) {
  console.log(
    ansiProvider.color(
      ColorType.Yellow,
      `Required node version ${engineVersion} not satisfied with current version ${process.version}.`
    )
  );
  process.exit(1);
}

(async function () {
  const version = packageJSON.version;
  const latestManifest = await pacote.manifest(packageJSON.name, {
    fullMetadata: false
  });

  if (latestManifest.version !== version) {
    console.warn(
      ansiProvider.color(
        ColorType.Yellow,
        `New version of ${packageJSON.name} is available ${latestManifest.version}.`
      )
    );
  }

  program.version(version);
  program.description('Web UI.');
  program.parse(process.argv);

  const indexFile = new URL('../out/index.html', import.meta.url);

  await open(indexFile.toString());
  process.exit(0);
})();
