const { promisify } = require('util')
const { glob } = require('glob')
const pGlob = promisify(glob)
const Logger = require('../logger')

module.exports = async (client) => {
  (await pGlob(`${process.cwd()}/selects/*/*.js`)).map(async selectMenuFile => {
    const selectMenu = require(selectMenuFile)
    if (!selectMenu.name) return Logger.warn(`Boutton non-chargée: Ajoutez un NOM à votre commande\nFichier -> ${selectMenuFile}`)
    client.selects.set(selectMenu.name, selectMenu)
  })
}
