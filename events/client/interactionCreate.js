const ownerid = '688098375697956905'
const langFr = require('../../languages/fr/events/interactionCreate.json')
const langEn = require('../../languages/en/events/interactionCreate.json')

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute (client, interaction) {
    // Commands deleting
    // console.log(interaction.commandId)
    // const devGuild1 = await client.guilds.cache.get('848598227301040159')
    // devGuild1.commands.delete(interaction.commandId) //
    // client.application.commands.delete(interaction.commandId)

    const guild = await client.getGuild(interaction.guild)
    const lang = guild.langue === 'fr' ? langFr : langEn

    if (interaction.isCommand() || interaction.isContextMenu()) {
      // let guildSettings = client.getGuild(interaction.guild)

      // if(!guildSettings) {
      // await client.createGuild(interaction.guild);
      // guildSettings = await client.getGuild(interaction.guild);
      // }

      const cmd = client.commands.get(interaction.commandName)

      if (!cmd) return interaction.reply(lang.commandDontExist)

      if (cmd.ownerOnly) {
        if (interaction.user.id !== ownerid) return interaction.reply({ content: lang.adminsOnly, ephemeral: true })
      }

      if (!interaction.member.permissions.has([cmd.permissions])) return interaction.reply({ content: `Vous n'avez pas la/les permission(s) requise(s) (\`${cmd.permissions.join(', ')}\`) pour tapper cette commande`, ephemeral: true })

      cmd.runInteraction(client, interaction)
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith('roleadd-')) { '../../buttons/other/addrole-button.js'.runInteraction(client, interaction) }
      const btn = client.buttons.get(interaction.customId)

      if (!btn) return console.log('Le boutton n\'a pas été trouvé !')
      btn.runInteraction(client, interaction)
    } else if (interaction.isSelectMenu()) {
      const selectMenu = client.selects.get(interaction.customId)

      if (!selectMenu) return interaction.reply(lang.menu)
      selectMenu.runInteraction(client, interaction)
    }
  }
}
