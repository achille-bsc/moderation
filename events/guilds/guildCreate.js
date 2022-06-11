const Logger = require('../../utils/logger')

module.exports = {
  name: 'guildCreate',
  once: false,
  async execute (client, guild) {
    const haveGuild = client.getGuild(guild)
    if (!haveGuild) {
      try {
        const guildCreated = await client.createGuild(guild)
        guildCreated.save()
      } catch (err) {
        Logger.error(err)
      }
    }
  }
}
