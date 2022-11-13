import * as shell from 'shelljs';

const shortSHA = shell
  .exec('echo $(git rev-parse --short HEAD)', { silent: true })
  .toString()
  .trim();

const sha = shell
  .exec('echo $(git rev-parse HEAD)', { silent: true })
  .toString()
  .trim();

const buildNumber = shell
  .exec('echo ${BUILD_NUMBER}', { silent: true })
  .toString()
  .trim();

const env = process.argv[2].toLowerCase();

// list all arguments
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

console.log('env: ', env);
console.log('sha: ', sha);
console.log('shortSHA: ', shortSHA);
console.log('buildNumber: ', buildNumber);

// update file path
if (env && ['dev', 'test', 'prod'].includes(env)) {
  const filePath = `.env.${env}`;

  shell.sed(
    '-i',
    'envFilePath:.*',
    `envFilePath: ['.env.${env}'],`,
    'src/app.module.ts',
  );

  shell.sed('-i', 'COMMIT_SHA=.*', `COMMIT_SHA=${sha}`, filePath);

  shell.sed(
    '-i',
    'COMMIT_SHORT_SHA=.*',
    `COMMIT_SHORT_SHA=${shortSHA}`,
    filePath,
  );

  shell.sed('-i', 'BUILD_NUMBER=.*', `BUILD_NUMBER=${buildNumber}`, filePath);

  console.log(shell.cat(filePath).toString());
} else {
  throw new Error("Argument must be 'dev', 'test', or 'prod'");
}
