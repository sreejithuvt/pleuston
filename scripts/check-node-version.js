//
// Checks the installed Node.js version against the version range
// defined in `engines` section of `package.json`
//
// To use in other projects:
//   - `npm i --save-dev semver ora chalk`
//   - `node check-node-version.js`
//   - setup as `preinstall` script in `package.json`
//

const semver = require('semver')
const ora = require('ora')
const chalk = require('chalk')
const { engines } = require('../package')

const version = engines.node

const spinner = ora('Checking installed Node.js version...').start()

if (!semver.satisfies(process.version, version)) {
    spinner.fail(
        `${chalk.red(` Required Node.js version ${version} not satisfied with current version ${process.version}.`)}
   ${chalk.grey(`Please install a compatible Node.js version and run npm install again.
   Use nvm for easy switching between Node.js versions https://github.com/creationix/nvm`)}`
    )
    process.exit(1)
}

spinner.succeed(chalk.green(' Required Node.js version is installed.\n'))
