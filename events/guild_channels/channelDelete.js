module.exports = {
  name: 'channelDelete',
  once: false,
  async execute (client, channel) {
    const dbGuild = await client.getGuild(channel.guild)
    if (dbGuild.privateRooms.includes(channel.id)) {
      dbGuild.privateRooms = dbGuild.privateRooms.splice(channel.id)
      await dbGuild.save()
    } else {
      if (dbGuild.privateRooms.includes(channel.id)) {
        dbGuild.privateRooms = dbGuild.privateRooms.splice(channel.id)
        await dbGuild.save()
      }
    }
  }
}
