const text_xp = require('../models/text_xp.js')
const text_xp_channel = require('../models/text_xp_channel.js')
const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord,
    MessageEmbed
} = require('discord.js');
const moment = require('moment')
const client = require('../index')
client.on("messageCreate", async (message) => {
    if (message.channel.type == 'DM') {
        return
    }

    function errors(content) {
        const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");
        message.reply({
            embeds: [embed]
        })
    }
    if (message.author.bot === true) return;
    const long = message.content

    function len(str) {
        return str.replace(/[^\x00-\xff]/g, "xx").length;
    }
    const messagexp = len(long) < 50 ? len(long) : 50;
    try {
        text_xp.findOne({
            guild: message.guild.id,
            member: message.member.id,
        }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new text_xp({
                    guild: message.guild.id,
                    member: message.member.id,
                    xp: messagexp,
                    leavel: "0"
                })
                data.save()
            } else if (data) {
                if (Number(messagexp) + Number(data.xp) > Number(data.leavel) * 100 + 100) {
                    data.collection.update(({
                        guild: message.guild.id,
                        member: message.member.id,
                    }), {
                        $set: {
                            leavel: `${Number(data.leavel) + 1}`
                        }
                    })
                    data.collection.update(({
                        guild: message.guild.id,
                        member: message.member.id,
                    }), {
                        $set: {
                            xp: `0`
                        }
                    })
                    text_xp_channel.findOne({
                        guild: message.guild.id,
                    }, async (err, data1) => {
                        if (data1) {
                            console.log(data1.channel)
                            const channel111 = data1.channel === "ONCHANEL" ? client.channels.cache.get(message.channel.id) : client.channels.cache.get(data1.channel)
                            if (!channel111) {
                                return errors("群組的升等頻道被刪除了，請重新設定升等消息!")
                            }
                            const hasPermissionInChannel = channel111
                                .permissionsFor(message.guild.me)
                                .has('SEND_MESSAGES', false)
                            const hasPermissionInChannel1 = channel111
                                .permissionsFor(message.guild.me)
                                .has('VIEW_CHANNEL', false)
                            if (!hasPermissionInChannel || !hasPermissionInChannel1) {
                                console.log("我沒權限啦 幹!")
                                return message.author.send("你升級了，但是我沒有權限在" + channel111.name + "發送消息!")
                            }
                            channel111.send(`🆙恭喜<@${message.member.id}> 的聊天等級成功升級到 ${Number(data.leavel) + 1}`)
                        } else {
                            return
                        }
                    })
                } else {
                    data.collection.update(({
                        guild: message.guild.id,
                        member: message.member.id,
                    }), {
                        $set: {
                            xp: `${messagexp + Number(data.xp)}`
                        }
                    })
                }
                data.save()
            }
        })
    } catch (error) {
        console.error(error)
        console.error(message.member)
        console.error(message)
    }
})