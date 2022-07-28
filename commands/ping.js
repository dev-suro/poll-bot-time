const { Command, CommandType } = require('gcommands');
const Discord = require('discord.js')
const ms = require('ms')

new Command({
	name: 'ping',
	description: 'Show bot ping',
	type: [CommandType.SLASH, CommandType.MESSAGE],
	run: (ctx) => {
        const pingmsg = new Discord.MessageEmbed
        pingmsg.setTitle('🏓 Pong!')
        pingmsg.setColor('RANDOM')
        pingmsg.setDescription(`**Ping**: ${ctx.client.ws.ping} ms`)
        ctx.reply({ embeds: [pingmsg]})
	}
});