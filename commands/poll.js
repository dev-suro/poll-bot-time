const { Command, CommandType, Argument, ArgumentType, MessageActionRow, MessageButton } = require('gcommands');
const Discord = require('discord.js')
const ms = require('ms')

new Command({
	name: 'poll',
	description: 'Create a poll',
	type: [CommandType.SLASH, CommandType.MESSAGE],
    arguments: [
        new Argument({
            name: 'question',
            description: 'Poll Question',
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: 'answera',
            description: 'Answer A',
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: 'answerb',
            description: 'Answer B',
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: 'time',
            description: 'Time of poll',
            type: ArgumentType.STRING,
            required: true
        })
    ],
	run: async (ctx) => {
        const answra = ctx.arguments.getString("answera")
        const answrb = ctx.arguments.getString("answerb")
        const question = ctx.arguments.getString("question")
        const time = ms(ctx.arguments.getString("time"))
        const time_ = ms(time, {long: true})
        let votes_a = 0
        let votes_b = 0
        const alreadyvoted = []
        let buttons1 = new MessageActionRow().addComponents([
            new MessageButton()
            .setLabel(`${answra}`)
            .setCustomId("a")
            .setStyle("SUCCESS"),
    
            new MessageButton()
            .setLabel(`${answrb}`)
            .setCustomId("b")
            .setStyle("DANGER"),
        ]);
        ctx.reply({content: 'Poll created!', ephemeral: true})
        const embed = new Discord.MessageEmbed()
        .setTitle(question)
        .setFooter(`This poll will end in ${time_}`)
        .setColor('RANDOM')

        let msg = await ctx.channel.send({
            embeds: [embed],
            components: [buttons1]
            })

        const thefilter = btn => btn.message.id === msg.id
        const collector = ctx.channel.createMessageComponentCollector({filter: thefilter, time: time})


        collector.on('collect', async (btn) => {
            if (alreadyvoted.includes(btn.user.id)) {
                const embed4 = new Discord.MessageEmbed()
                .setTitle('You already voted!')
                .setColor('RED')
                btn.reply({ embeds: [embed4], ephemeral: true})
            } else {
            if (btn.customId === 'a') {
                ++votes_a
                alreadyvoted.push(btn.user.id)
                console.log(alreadyvoted)
                const embed2 = new Discord.MessageEmbed()
                .setTitle(question)
                .setColor('RANDOM')
                .setDescription(`**${answra}**: ${votes_a} votes\n**${answrb}**: ${votes_b} votes`)
                .setFooter(`This poll will end in ${time_}`)
                msg.edit({
                    embeds: [embed2]
                    })
                btn.reply({content: `You voted **${answra}**`, ephemeral: true})
            } else if (btn.customId === 'b') {
                ++votes_b
                alreadyvoted.push(btn.user.id)
                console.log(alreadyvoted)
                const embed2 = new Discord.MessageEmbed()
                .setTitle(question)
                .setColor('RANDOM')
                .setDescription(`**${answra}**: ${votes_a} votes\n**${answrb}**: ${votes_b} votes`)
                .setFooter(`This poll will end in ${time_}`)
                msg.edit({
                    embeds: [embed2]
                    })
                btn.reply({content: `You voted **${answrb}**`, ephemeral: true})
            }
        }
            })

        collector.on('end', async (btn) => {
            const embed3 = new Discord.MessageEmbed()
            .setTitle(question)
            .setDescription(`**Results**:\n**${answra}**: ${votes_a} votes\n**${answrb}**: ${votes_b} votes`)
            const buttons2 = new MessageActionRow().addComponents([
                new MessageButton()
                .setLabel('Ended!')
                .setCustomId('ended')
                .setStyle('DANGER')
                .setDisabled(true)
            ])
            msg.edit({
                embeds: [embed3],
                components: [buttons2]
            })
        })
         
	}
});