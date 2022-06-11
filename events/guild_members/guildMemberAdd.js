const { MessageEmbed } = require('discord.js')
const langFr = require('../../languages/fr/events/guildMemberAdd.json')
const langEn = require('../../languages/en/events/guildMemberAdd.json')

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute (client, member) {
    const guild = await client.getGuild(member.guild)
    const lang = guild.langue === 'fr' ? langFr : langEn

    if (guild.welcomeMessageEnabled) {
      let description = guild.welcomeMessage.replace('{member}'.toLowerCase(), member.user.username)
      description = description.replace('{membercount}'.toLowerCase(), member.guild.memberCount)
      const embed = new MessageEmbed()
        .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL() })
        .setColor('GREEN')
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: `${lang.footer}` })

      const welcomeChannel = client.channels.cache.get(guild.welcomeChannel)

      try {
        welcomeChannel.send({ embeds: [embed] })
      } catch (error) {}
    }
  }
}
