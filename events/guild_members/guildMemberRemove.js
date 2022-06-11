const { MessageEmbed } = require('discord.js')
const langFr = require('../../languages/fr/events/guildMemberRemove.json')
const langEn = require('../../languages/en/events/guildMemberRemove.json')
module.exports = {
  name: 'guildMemberRemove',
  once: false,
  async execute (client, member) {
    const guild = await client.getGuild(member.guild)
    const lang = guild.langue === 'fr' ? langFr : langEn

    if (guild.goodByeMessageEnabled) {
      let description = guild.goodByeMessage.replace('{member}'.toLowerCase(), member.user.username)
      description = description.replace('{membercount}'.toLowerCase(), member.guild.memberCount)
      const embed = new MessageEmbed()
        .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL() })
        .setColor('RED')
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: `${lang.footer}` })

      const logChannel = client.channels.cache.get(guild.goodByeChannel)

      try {
        logChannel.send({ embeds: [embed] })
      } catch (error) {}
    }
  }
}
