const { Permissions } = require('discord.js')
module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  async execute (client, oldState, newState) {
    const dbGuild = await client.getGuild(newState.guild)

    if (dbGuild.privateRooms.includes(newState.channelId)) {
      if (dbGuild.rooms.includes(oldState.channelId)) {
        const channel = oldState.guild.channels.cache.get(oldState.channelId)
        if (channel.members?.size === 0) {
          setTimeout(async () => {
            if (channel.members?.size === 0) {
              await channel.delete().then(async () => {
                for (const channelID of dbGuild.rooms) {
                  if (channelID === oldState.channelId) {
                    dbGuild.rooms = dbGuild.rooms.splice(channelID)
                    await dbGuild.save()
                  }
                }
              })
            }
          }, dbGuild.roomsDeleteTimeInSec * 1000)
        }

      // setTimeout(() => {
      //   channel.delete()
      // }, 25000)
      }
      const channel = newState.guild.channels.cache.get(newState.channelId)
      const parent = channel.parent
      const guild = channel.guild
      const member = guild.members.cache.get(newState.id)
      const createdChannel = await guild.channels.create(`Salon de ${member.user.username}`, {
        type: 'GUILD_VOICE',
        permissionOverwrites: [
          {
            id: member,
            allow: [Permissions.FLAGS.CONNECT, Permissions.FLAGS.MOVE_MEMBERS, Permissions.FLAGS.MUTE_MEMBERS, Permissions.FLAGS.PRIORITY_SPEAKER, Permissions.FLAGS.SPEAK, Permissions.FLAGS.DEAFEN_MEMBERS]
          }
        ]
      })
      createdChannel.setParent(parent)
      dbGuild.rooms.push(`${createdChannel.id}`)
      dbGuild.save().then(() => {
        member.voice.setChannel(createdChannel)
      }).catch(() => null)
    } else if (dbGuild.rooms.includes(oldState.channelId)) {
      const channel = oldState.guild.channels.cache.get(oldState.channelId)
      if (channel.members?.size === 0) {
        setTimeout(async () => {
          if (channel.members?.size === 0) {
            await channel.delete().then(async () => {
              for (const channelID of dbGuild.rooms) {
                if (channelID === oldState.channelId) {
                  dbGuild.rooms = dbGuild.rooms.splice(channelID)
                  await dbGuild.save()
                }
              }
            })
          }
        }, dbGuild.roomsDeleteTimeInSec * 1000)
      }

      // setTimeout(() => {
      //   channel.delete()
      // }, 25000)
    }
  }
}
