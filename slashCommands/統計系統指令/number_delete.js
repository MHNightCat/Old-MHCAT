const Number = require("../../models/Number.js");
const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageAttachment,
    Permissions

} = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
    name: '統計系統刪除',
    description: '刪除統計消息',
    UserPerms: 'MANAGE_MESSAGES',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:delete1:986068526387314690>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        Number.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(data){
                data.delete()
                const embed = new MessageEmbed()
                .setTitle("<a:greentick:980496858445135893> | 成功刪除，該類別以下的頻道我已經管不了囉!(類別id:" + data.parent + ")")
                .setColor("GREEN")
                interaction.reply({embeds: [embed]})
            }else{
                return errors("你還沒有創建過統計數據，是要刪除甚麼啦!")           
            }
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
}}