const coin = require("../../models/coin.js");
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
    name: '扭蛋代幣增加',
    description: '改變扭蛋數量',
    options: [{
        name: '使用者',
        type: 'USER',
        description: '要改變的人',
        required: true,
    },{
        name: '增加或減少',
        type: 'STRING',
        description: '輸入這個獎品叫甚麼，以及簡單概述',
        required: true,
        choices:[
            { name: '增加', value: 'add' },
            { name: '減少', value: 'reduce' },
        ],
    },{
        name: '數量',
        type: 'INTEGER',
        description: '增加或減少的數量',
        required: true,
    }],     
    video: 'https://mhcat.xyz/docs/coin_increase',
    emoji: `<:income:997374186794258452>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        const user = interaction.options.getUser("使用者")
        const add_reduce = interaction.options.getString("增加或減少")
        const number = interaction.options.getInteger("數量")
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        coin.findOne({
                guild: interaction.guild.id,
                member: user.id
            }, async (err, data) => {
                if(!data){
                    if(add_reduce === "reduce")return errors("不可減到負數!")
                    data = new coin({
                        guild: interaction.guild.id,
                        member: user.id,
                        coin: Number(number),
                        today: true
                    })
                    data.save()
                }else{
                    if(add_reduce === "reduce"){
                        if(data.coin - number < 0) return errors("不可減到負數!")
                        data.collection.updateOne(({guild: interaction.channel.guild.id, member: user.id}), {$set: {coin: data.coin - Number(number)}})
                    }else{
                        if(data.coin + Number(number) > 999999999) return errors("不可以加超過`999999999`!!")
                        data.collection.updateOne(({guild: interaction.channel.guild.id, member: user.id}), {$set: {coin: data.coin + Number(number)}})
                    }
                }
                const good = new MessageEmbed()
                .setTitle(`<:money:997374193026994236>已為${user.username}\`${add_reduce === "reduce" ? "減少" : "增加"}\`:\`${number}\`個代幣!`)
                .setFooter(`增加${number}`,interaction.member.displayAvatarURL({
                    dynamic: true
                }))
                .setColor('RANDOM')
                interaction.reply({embeds: [good]})
            })

        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}