//Since this code is very very huge... i will copy paste the code i made before recording
// but i will explain everything in it
const {
    MessageEmbed,
    Message,
    Client,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const {
    readdirSync
} = require("fs");
const client = require('../../index')
const prefix = client.config.prefix; // this one gets the prefix
let color = "RANDOM"; // this is the color of the embed

const create_mh = require(`../../functions/menu.js`); // this one gets the dropdown menu

module.exports = {
    name: '翻譯',
    description: '翻譯成各種語言',
    options: [{
        name: '要的翻譯',
        description: '你要翻譯的句子或是單詞!',
        required: true,
        type: 'STRING',
    },{
        name: '目標語言',
        description: '你要翻譯成的語言!',
        required: true,
        type: 'STRING',
        choices:[
            { name: '🇹🇼中文(traditional Chinese)', value: 'zh-TW' },
            { name: '🇺🇸英文(English)', value: 'en' },
            { name: '🇯🇵日文(Japanese)', value: 'ja' },
            { name: '🇰🇷韓語(Korean)', value: 'ko' },
            { name: '🇩🇪德語(German)', value: 'de' },
            { name: '🇫🇷法語(French)', value: 'fr' },
            { name: '🇷🇺俄語(Russian)', value: 'ru' },
            { name: '🇪🇸西班牙語(Spanish)', value: 'es' },
            { name: '🇨🇳簡體中文(Simplified Chinese)', value: 'zh-CN' },
        ]
        
    }],
    video: 'https://mhcat.xyz/docs/translate',
    emoji: `<:help:985948179709186058>`,
    run: async (client, interaction, options) => {
        try {
        await interaction.deferReply().catch(e => { });
        const get_member = interaction.options.getString("要的翻譯")
        const aaa = interaction.options.getString("目標語言")
        const lodding = new MessageEmbed().setTitle("<a:load:986319593444352071> | 我正在玩命幫你翻譯!").setColor("GREEN")
        const lodding_msg = await interaction.followUp({
            embeds: [lodding]
        })
        const translate = require('@vitalets/google-translate-api');
        const token = require('google-translate-token');
        const a =  token.get('Hello')
        translate(get_member, {to: aaa}).then(res => {
            const embed = new MessageEmbed()
            .setTitle("<:translate:986870996147507231> 翻譯系統")
            .addField("**<:edittext:986873966884962304> 原文**:", `\`${get_member}\``)
            .addField("**<:answer:986873630178832414> 目標語言:**", `\`${aaa}\``)
            .addField("**<:translate1:986873633483939901> 譯文:**", `\`${res.text}\``)
            .setColor("RANDOM")
            .setFooter(
                    `來自${interaction.user.tag}的查詢 | by: MHCAT`,
                    interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                );
        lodding_msg.edit({embeds: [embed]})
        }).catch(err => {
            console.error(err);
        });

    } catch (error) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setURL("https://discord.gg/7g7VE2Sqna")
            .setStyle("LINK")
            .setLabel("支援伺服器")
            .setEmoji("<:customerservice:986268421144592415>"),
            new MessageButton()
            .setURL("https://mhcat.xyz")
            .setEmoji("<:worldwideweb:986268131284627507>")
            .setStyle("LINK")
            .setLabel("官方網站")
        );
        return interaction.reply({
            embeds:[new MessageEmbed()
            .setTitle("<a:error:980086028113182730> | 很抱歉，出現了錯誤!")
            .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\`\n常見錯誤:\n\`Missing Access\`:**沒有權限**\n\`Missing Permissions\`:**沒有權限**`)
            .setColor("RED")
            ],
            components:[row]
        })
    }
    },
}; 