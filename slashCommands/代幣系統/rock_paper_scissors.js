const coin = require("../../models/coin.js");
const {
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Collector,
    Discord,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    PermissionsBitField
} = require('discord.js');
module.exports = {
    name: 'Rock-paper-scissors',
    cooldown: 10,
	description: '',
	description_localizations: {
		"en-US": "Play rps with robot to win coins!",
		"zh-TW": "跟電腦剪刀時候布來獲得代幣(有賺有賠)",
	},
    options: [{
        name: 'Bet',
        type: ApplicationCommandOptionType.Integer,
		description: '',
		description_localizations: {
			"en-US": "How many coins you want to bet(If you win, you get coins you enter, if lose, decrease enteramount/2)",
			"zh-TW": "要用多少代幣進行賭注(贏的話會多這些，輸的話這些代幣會全被拿走，平手會被扣這些的一半)",
		},
        required: true,
    }, {
        name: 'Rock-paper-or-scissors',
        type: ApplicationCommandOptionType.String,
		description: '',
		description_localizations: {
			"en-US": "Select rock, paper, or scissors",
			"zh-TW": "選擇要剪刀石頭還是布",
		},
        required: true,
        choices: [{
                name: 'Scissors',
                value: '剪刀'
            },
            {
                name: 'Rock',
                value: '石頭'
            },
            {
                name: 'Paper',
                value: '布'
            },
        ],
    }],
    video: 'https://mhcat.xyz/docs/required_coins',
    emoji: `<:coins:997374177944281190>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();

            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const number = interaction.options.getInteger("使用多少代幣來進行")
            const aaaaa = interaction.options.getString("剪刀石頭或布")
            if (number > 999999999) return errors("最高代幣設定數只能是999999999")
            if (number <= 0) return errors("至少要大於1!!")
            coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id,
            }, async (err, data) => {
                if (!data) {
                    return errors("你沒有足夠的代幣進行此次遊玩!")
                } else {
                    if (data.coin - number < 0) return errors("你沒有足夠的代幣進行此次遊玩")

                    function getRandom(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    const vaule = ["剪刀", "石頭", "布"]
                    const emoji = ["✂️", "🪨", "🖐"]
                    const random = getRandom(0, 2)

                    function adddd(add, dsadsa) {
                        const good = new EmbedBuilder()
                            .setTitle(`<a:girl:983775481100914788> __**剪刀石頭布!**__`)
                            .setDescription(`**你出了:**\`${aaaaa==="石頭" ? "🪨":aaaaa==="剪刀" ? "✂️" : "🖐"}${aaaaa}\`\n**我出了:**\`${emoji[random]}${vaule[random]}\`\n**${dsadsa}:**\`${add}\`個代幣`)
                            .setFooter({
                                text: "剪刀石頭布! | MHCAT",
                                iconURL: interaction.member.displayAvatarURL({
                                    dynamic: true
                                })
                            })
                            .setColor('Random')
                        interaction.editReply({
                            embeds: [good]
                        })
                    }
                    if (vaule[random] === aaaaa) {
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: data.coin - parseInt(number / 2)
                            }
                        })
                        adddd(parseInt(number / 2), "你失去了")
                    } else if (((aaaaa === "剪刀") && (vaule[random] === "石頭")) || ((aaaaa === "石頭") && (vaule[random] === "布")) || ((aaaaa === "布") && (vaule[random] === "剪刀"))) {
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: data.coin - number
                            }
                        })
                        adddd(parseInt(number), "你失去了")
                    } else if (((aaaaa === "剪刀") && (vaule[random] === "布")) || ((aaaaa === "石頭") && (vaule[random] === "剪刀")) || ((aaaaa === "布") && (vaule[random] === "石頭"))) {
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: data.coin + number
                            }
                        })
                        adddd(parseInt(number), "你獲得了")

                    }
                }
            })
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
