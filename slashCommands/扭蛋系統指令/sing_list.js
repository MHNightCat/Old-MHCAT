const coin = require("../../models/coin.js");
const gift_change = require("../../models/gift_change.js");
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions
 } = require('discord.js');
const { errorMonitor } = require("ws");
module.exports = {
    name: '簽到列表',
    description: '簽到來獲得扭蛋代幣',
    video: 'https://mhcat.xyz/docs/snig',
    emoji: `<:sign:997374180632825896>`,
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                gift_change.findOne({
                    guild: interaction.guild.id,
                }, async (err, data1111) => {
                if(!data){
                    data = new coin({
                        guild: interaction.guild.id,
                        member: interaction.member.id,
                        coin: data1111 ? data1111.sign_coin : 25,
                        today: true
                    })
                    data.save()
                }else{
                    if(data.today) return errors("你今天已經簽到過了!請於明天再來簽到!")
                    if(data.coin + Number((data1111 ? data1111.sign_coin : 25)) > 999999999) return errors("不可以加超過`999999999`!!")
                    data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {today: true}})
                    data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin + (data1111 ? data1111.sign_coin : 25)}})
                }
                const good = new MessageEmbed()
                .setTitle("<:calendar:990254384812290048>你成功簽到了!")
                .setDescription("<:Cat_ThumbsUp:988665659850362920> 今天有準時簽到很棒喔!\n明天也要記得來簽到.w.")
                .setColor('RANDOM')
                interaction.reply({embeds: [good]})
            })
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
