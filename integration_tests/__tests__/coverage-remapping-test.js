/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const {readFileSync} = require('fs');
const {run} = require('../utils');
const path = require('path');
const runJest = require('../runJest');
const skipOnWindows = require('skipOnWindows');

skipOnWindows.suite();

it('maps code coverage against original source', () => {
  const dir = path.resolve(__dirname, '../coverage-remapping');
  run('npm install', dir);
  runJest(dir, ['--coverage', '--mapCoverage', '--no-cache']);

  const coverageMapFile = path.join(
    __dirname,
    '../coverage-remapping/coverage/coverage-final.json',
  );
  const coverageMap = JSON.parse(readFileSync(coverageMapFile, 'utf-8'));

  // reduce absolute paths embedded in the coverage map to just filenames
  Object.keys(coverageMap).forEach(filename => {
    coverageMap[filename].path = path.basename(coverageMap[filename].path);
    coverageMap[path.basename(filename)] = coverageMap[filename];
    delete coverageMap[filename];
  });
  expect(coverageMap).toMatchSnapshot();
});
