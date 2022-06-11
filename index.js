const { Client, Collection } = require('discord.js')
const dotenv = require('dotenv'); dotenv.config()
const mongoose = require('mongoose')
const client = new Client({ intents: 98303 })
const Logger = require('./utils/logger')
const config = require('./config.json')
require('colors')

const X = ['commands', 'buttons', 'selects']
const handlers = ['EventUtil', 'CommandUtil', 'ButtonUtil', 'SelectUtil']
require('./utils/Functions')(client)

X.forEach(x => {
  client[x] = new Collection()
})
handlers.forEach(handler => {
  require(`./utils/handlers/${handler}`)(client)
}
)

process.on('exit', code => { Logger.client(`Le precessus s'est arrêté avec le code ${code} !`) })
process.on('uncaughtException', (err, origin) => {
  Logger.error(`UNCAUGHT_EXCEPTION: ${err}`)
  console.error(`Origine: ${origin}`)
})
process.on('unhandledRejection', (reason, promise) => {
  Logger.warn(`UNHANDLED_REJECTION: ${reason}`)
  console.log(promise)
})
process.on('warning', (...args) => { Logger.warn(...args) })