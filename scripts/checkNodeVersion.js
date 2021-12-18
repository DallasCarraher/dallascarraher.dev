const child_process = require('child_process')

function getNodeVersion() {
  const version = child_process.spawn('node', ['--version'])
  return new Promise(function (resolve, reject) {
    version.stdout.on('data', function (data) {
      const nodeVersion = data.toString('utf8').replace(/(\r|\n).*/, '')
      if (nodeVersion.trim() !== 'v16.13.1') {
        reject({ code: 1, version: nodeVersion })
        return
      }
      resolve(0)
    })

    version.stderr.on('data', function (data) {
      reject({ code: 2 })
    })

    version.on('close', function (code) {
      if (code !== 0) {
        reject({ code })
      }
    })
  })
}

getNodeVersion()
  .then(function () {
    console.log('Success!')
    process.exit(0)
  })
  .catch(function (err) {
    let message =
      "\n❌ You're using the wrong version of node for this project."
    message += "\nMake sure you're using v16.13.1 👍"

    if (err.version) {
      message += `\r\n\nYour current node version is ${err.version} 🤭\n\n`
    }

    message += 'If you have nvm installed, run:\n'
    message += 'nvm install 16.13.1\n'
    message += 'nvm use 16.13.1\n'

    let nvmLink = 'https://github.com/creationix/nvm'
    if (process.platform === 'win32') {
      nvmLink = 'https://github.com/coreybutler/nvm-windows'
    }

    message += `\r\nIf you're not using nvm, install nvm from here: 👉 ${nvmLink} 👈 \n`

    console.error(message)
    process.exit(err.code)
  })
