const { MessageEmbed, Message, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'ban',
	description: 'Permet de bannir un membre',
    permissions: ['BAN_MMEBERS'],
	ownerOnly: false,
	usage: 'ban <member> [reason]',
	examples: ['ban @exemple#0000', 'ban @exemple#0000 pas gentil'],
	category: 'Administration',
	options: [
    {
			name: 'temporaire',
			description: 'permet de bannir temporairement un membre',
			type: 'SUB_COMMAND',
      options: [
        {
          name: 'membre',
          description: 'Membre à bannir',
          type: 'USER',
          required: true,
        },
        {
          name: 'duree',
          description: 'nombre de jours pour les quelle vous souhaitez bannir le membre',
          type: 'NUMBER',
          minValue: 0,
          maxValue: 7,
          required: true,
        },
        {
          name: 'reason',
          description: 'Raison pour la quelle vous souhaitez bannir le membre',
          type: 'STRING',
          required: false,
        },
      ]
		},
    {
			name: 'permanent',
			description: 'permet de bannir de façon permanante un membre',
			type: 'SUB_COMMAND',
      options: [
        {
          name: 'membre',
          description: 'Membre à bannir',
          type: 'USER',
          required: true,
        },
        {
          name: 'reason',
          description: 'Raison pour la quelle vous souhaitez bannir le membre',
          type: 'STRING',
          required: false,
        }
      ]
		},
		
	],
	async runInteraction (client, interaction) {
		const member = interaction.options.getUser('membre')
    const reason = interaction.options.getString('reason')
    let time = null
    if (interaction.options.getSubcommande() === 'temporaire') {
      time = interaction.options.getNumber('duree')
    }

    interaction.guild.members.ban(member, { days: time === null ? 0 : time, reason: reason })
      .then(banInfo => console.log(`Banned ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`))
      .catch(console.error);
	}
};