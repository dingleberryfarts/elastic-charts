/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import path from 'path';

import { exec, downloadArtifacts, startGroup, yarnInstall, getNumber, decompress, compress } from '../../utils';
import { ENV_URL } from '../../utils/constants';

const jobIndex = getNumber(process.env.BUILDKITE_PARALLEL_JOB);
const shardIndex = jobIndex ? jobIndex + 1 : 1;
const jobTotal = getNumber(process.env.BUILDKITE_PARALLEL_JOB_COUNT);

const shard = jobIndex !== null && jobTotal !== null ? ` --shard=${shardIndex}/${jobTotal}` : '';

void (async () => {
  yarnInstall('e2e');

  const src = '.buildkite/artifacts/e2e_server.gz';
  downloadArtifacts(src, 'e2e_server');
  await decompress({
    src,
    dest: 'e2e/server',
  });

  startGroup('Check Architecture');
  exec('arch');

  startGroup('Generating test examples.json');
  // TODO Fix this duplicate script that allows us to skip root node install on all e2e test runners
  exec('node ./e2e/scripts/extract_examples.js');

  startGroup('Running e2e playwright job');
  const reportDir = `reports/report_${shardIndex}`;
  async function compressReport() {
    await compress({
      src: path.join('e2e', reportDir),
      dest: `.buildkite/artifacts/e2e_reports/report_${shardIndex}.gz`,
    });
  }

  // TODO revert this toggle
  const command =
    (jobTotal ?? 0) > 1
      ? `yarn playwright test --project=Chrome${shard}`
      : 'sh ./scripts/start_test.sh --project=Chrome stylings_stories.test.ts';
  try {
    exec(command, {
      cwd: 'e2e',
      env: {
        [ENV_URL]: 'http://127.0.0.1:9002',
        PLAYWRIGHT_HTML_REPORT: reportDir,
        PLAYWRIGHT_JSON_OUTPUT_NAME: `reports/json/report_${shardIndex}.json`,
      },
    });
    await compressReport();
  } catch (error) {
    await compressReport();
    throw error;
  }
})();
