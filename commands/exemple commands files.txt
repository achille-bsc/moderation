const { MessageEmbed, Message, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'clear',
	description: 'Supprime entre 1 à 100 messages dans une conversation ou pour un utilisateur seulement',
    permissions: ['MANAGE_MESSAGES'],
	ownerOnly: false,
	usage: 'clear [nombre] <@utilisateur> <#salon>',
	examples: ['clear 99', 'clear 7 #général' , 'clear 5 @exemple#0000', 'clear 25 @éxemple#0000 #général'],
	category: 'conversation',
	async run (client, message, args) {

		const amountToDelete = args[0]
		if(!args[0]) return message.reply({ content: `❌ Vous devez indiquer un nombre de messages à supprimer ! ❌` })
		if(amountToDelete > 100 || amountToDelete < 1 ) return message.reply({ content: '❌ Le nombre de messages doit être compris entre 1 et 100 inclus ❌' })
		const target = message.mentions.users.find(u => u.id);
		await message.delete();

		const messagesToDelete = await message.channel.messages.fetch();

		if(target) {
			let i = 0;
			const filteredTargetMessages = [];
			(await messagesToDelete).filter(msg => {
				if (msg.author.id == target.id && amountToDelete > i) {
					filteredTargetMessages.push(msg); i++;
				}
			});

			await message.channel.bulkDelete(filteredTargetMessages, true).then(messages => {
				message.channel.send({ content: `J'ai supprimé \`${messages.size}\` messages sur l'utilisateur ${target} dans le salon <#${message.channel.id}>`})
			})
		} else {
			await message.channel.bulkDelete(amountToDelete, true).then(messages => {
				message.channel.send({ content: `J'ai supprimé \`${messages.size}\` messages dans le salon <#${message.channel.id}>`})
			})
		}
		
	},
	options: [
		{
			name: 'messages',
			description: 'Nombre de messages à supprimer',
			type: 'NUMBER',
			required: true,
		},
		{
			name: 'user',
			description: 'Membre dont vous voullez supprimer les messages',
			type: 'USER',
			required: false,
		},
		{
			name: 'channel',
			description: 'Salon dans le quelle vous souhaitez supprimer les messages',
			type: 'CHANNEL',
			required: false,
		},
		
	],
	async runInteraction (client, interaction) {
		const amountToDelete = interaction.options.getNumber('messages');
		if(amountToDelete > 100 || amountToDelete < 1 ) return interaction.reply({ content: 'Le nombre de messages doit être compris entre 1 et 100 inclus', ephemeral: true })
		const target = interaction.options.getMember('user');
		let channelToDelete = interaction.options.getChannel('channel');
		if(!channelToDelete) { channelToDelete = interaction.channel }

		const messagesToDelete = await interaction.channel.messages.fetch();

		if(target) {
			let i = 0;
			const filteredTargetMessages = [];
			(await messagesToDelete).filter(msg => {
				if (msg.author.id == target.id && amountToDelete > i) {
					filteredTargetMessages.push(msg); i++;
				}
			});

			await channelToDelete.bulkDelete(filteredTargetMessages, true).then(messages => {
				interaction.reply({ content: `J'ai supprimé ${messages.size} messages sur l'utilisateur ${target} dans le salon <#${channelToDelete.id}>`, ephemeral: true })
			})
		} else {
			await channelToDelete.bulkDelete(amountToDelete, true).then(messages => {
				interaction.reply({ content: `J'ai supprimé ${messages.size} messages dans le salon <#${channelToDelete.id}>`, ephemeral: true })
			})
		}
	}
};