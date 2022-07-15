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
    name: 'help',
    description: '使用我開始使用',
    options: [{
        name: '指令名稱',
        description: '輸入指令名稱(可不輸入)!',
        required: false,
        type: 'STRING',
    }],
    video: 'https://mhcat.xyz/docs/help',
    emoji: `<:help:985948179709186058>`,
    run: async (client, interaction, options, perms) => {
        try {
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.followUp({embeds: [embed]})}
        const get_member = interaction.options.getString("指令名稱")
        let categories = [];
        let cots = [];

        if (!get_member) {

            let ignored = [
                "test"
            ];

            const emo = {
        管理系統指令: "<:manager:986069915129769994>",
        公告系統指令: "<:megaphone:985943890148327454>",
        私人頻道指令: "<:ticket:985945491093205073>",
        語音包廂指令: ":sound:",
        經驗系統指令: "<:level1:985947371957547088>",
        抽獎系統指令: "<:lottery:985946439253381200>",
        統計系統指令: ":bar_chart:",
        音樂系統指令: "<:music1:985946956591423518>",
        加入設置指令: "🪂",
        驗證系統指令: "<:tickmark:985949769224556614>",
        實用指令資訊: "<:bestpractice:986070549115596950>",
        警告系統指令: "<:warning:985590881698590730>",
        備份系統指令: "<:backup:992010707354783775>",
        扭蛋系統指令: "<:vendingmachine:997374191651274823>",
        自動通知指令: "<:alarmclock:997415306530131980>"
            }
            const description = {
        管理系統指令: "管理員一定要看這個，非常適合管理伺服器",
        公告系統指令: "讓你的公告不再是普通的文字",
        私人頻道指令: "一個簡單的客服頻道系統",
        語音包廂指令: "創建一個可活動的語音頻道",
        經驗系統指令: "各種經驗系統，例如語音經驗及聊天經驗",
        抽獎系統指令: "一起來進行抽獎，來獲得非常棒的獎品吧",
        統計系統指令: "頻道變身成一個伺服器資料報告",
        音樂系統指令: "讓discord可以聽音樂",
        加入設置指令: "當玩加入或離開時，要做一些動作",
        驗證系統指令: "讓有人加入時防止是機器人",
        實用指令資訊: "查看一些實用的功能",
        警告系統指令: "讓你的警告可以進行紀錄，還可自動停權",
        備份系統指令: "讓你的伺服器受到多一層的保障",
        扭蛋系統指令: "透過簽到以及聊天來獲得扭蛋代幣進行扭蛋",
        自動通知指令: "在一個特定的時間發送通知"
        }

            let ccate = [];

            readdirSync("./slashCommands/").forEach((dir) => {
                if (ignored.includes(dir.toLowerCase())) return;
                const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                if (ignored.includes(dir.toLowerCase())) return;

                const name = `${emo[dir]} - ${dir}`;
                let nome = dir.toUpperCase();

                let cats = new Object();

                cats = {
                    name: name,
                    value: `\`${description[dir]}\``,
                    inline: true
                }


                categories.push(cats);
                ccate.push(nome);
            }); 
            //embed
            const embed = new MessageEmbed()
                .setTitle(`<:Discord_Bot:986319391660593172> 機器人指令`)
                .setDescription(`>>> 我的前奏為 \`/\`\n開啟此清單, 或是使用 \`/help 指令名稱:[指令名稱]\` 來了解這個指令用法!`)
                .addFields(categories)
                .setFooter(
                    `來自${interaction.user.tag}的查詢`,
                    interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setTimestamp()
                .setColor(color)
            let menus = create_mh(ccate);
            return interaction.followUp({
                embeds: [embed],
                components: menus.smenu, 
            }).then((msgg) => {
                const menuID = menus.sid;

                const select = async (interaction01) => {
                    if (interaction01.customId != menuID) return;

                    let {
                        values
                    } = interaction01;

                    let value = values[0];

                    let catts = [];

                    readdirSync("./slashCommands/").forEach((dir) => {
                        if (dir.toLowerCase() !== value.toLowerCase()) return;
                        const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                            file.endsWith(".js")
                        );


                        const cmds = commands.map((command) => {
                            let file = require(`../../slashCommands/${dir}/${command}`); //getting the commands again

                            if (!file.name) return "沒有任何指令";

                            let name = file.name.replace(".js", "");

                            if (client.slash_commands.get(name).hidden) return;


                            let des = client.slash_commands.get(name).description;
                            let emo = client.slash_commands.get(name).emoji;
                            let emoe = emo ? `${emo} - ` : ``;

                            let obj = {
                                cname: `${emoe}\`${name}\``,
                                des
                            }

                            return obj;
                        });

                        let dota = new Object();

                        cmds.map(co => {
                            if (co == undefined) return;

                            dota = {
                                name: `${cmds.length === 0 ? "進行中" : co.cname}`,
                                value: co.des ? `\`${co.des}\`` : `\`沒有說明\``,
                                inline: true,
                            }
                            catts.push(dota)
                        });

                        cots.push(dir.toLowerCase());
                    });

                    if (cots.includes(value.toLowerCase())) {
                        const combed = new MessageEmbed()
                            .setTitle(`__${emo[value.charAt(0).toUpperCase() + value.slice(1)]} ${value.charAt(0).toUpperCase() + value.slice(1)} 指令!__`)
                            .setDescription(`> 使用 \`/help\` 或加上指令名稱以獲取有關指令的更多信息!\n> 例: \`/help 指令名稱:公告發送\`\n\n`)
                            .addFields(catts)
                            .setColor(color)
                            .setFooter(`來自${interaction.user.tag}的查詢`,
                    interaction.user.displayAvatarURL({
                        dynamic: true
                    }))

                        await interaction01.deferUpdate();

                        return interaction01.message.edit({
                            embeds: [combed],
                            components: menus.smenu
                        })
                    };

                };

                const filter = (interaction01) => {
                    return !interaction01.user.bot && interaction01.user.id == interaction.user.id
                };

                const collector = msgg.createMessageComponentCollector({
                    filter,
                    componentType: "SELECT_MENU"
                });
                collector.on("collect", select);
                collector.on("end", () => null);

            });

        } else {
            let catts = [];

            readdirSync("./slashCommands/").forEach((dir) => {
                if (dir.toLowerCase() !== get_member.toLowerCase()) return;
                const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );


                const cmds = commands.map((command) => {
                    let file = require(`../../slashCommands/${dir}/${command}`);

                    if (!file.name) return "沒有指令名稱";

                    let name = file.name.replace(".js", "");

                    if (client.slash_commands.get(name).hidden) return;


                    let des = client.slash_commands.get(name).description;
                    let emo = client.slash_commands.get(name).emoji;
                    let emoe = emo ? `${emo} - ` : ``;

                    let obj = {
                        cname: `${emoe}\`${name}\``,
                        des
                    }

                    return obj;
                });

                let dota = new Object();

                cmds.map(co => {
                    if (co == undefined) return;

                    dota = {
                        name: `${cmds.length === 0 ? "進行中" : prefix + co.cname}`,
                        value: co.des ? co.des : `沒有說明`,
                        inline: true,
                    }
                    catts.push(dota)
                });

                cots.push(dir.toLowerCase());
            });

            const command =
                client.slash_commands.get(get_member.toLowerCase()) ||
                client.slash_commands.find(
                    (c) => c.aliases && c.aliases.includes(get_member.toLowerCase())
                );

            if (cots.includes(get_member.toLowerCase())) {
                const combed = new MessageEmbed()
                    .setTitle(`__${get_member.charAt(0).toUpperCase() + get_member.slice(1)} 指令!__`)
                    .setDescription(`> 使用 \`/help\` 或加上指令名稱以獲取有關指令的更多信息.\n> 例: \`/help 指令名稱:公告發送\`.\n\n`)
                    .addFields(catts)
                    .setColor(color)
                    .setFooter(`來自${interaction.user.tag}的查詢`,
                    interaction.user.displayAvatarURL({
                        dynamic: true
                    }))

                return interaction.followUp({
                    embeds: [combed]
                })
            };

            if (!command) {
                const embed = new MessageEmbed()
                    .setTitle(`無效的指令! 使用 \`/help\` 查看所有指令!`)
                    .setColor("RED");
                return await interaction.followUp({
                    embeds: [embed],
                    allowedMentions: {
                        repliedUser: false
                    },
                });
            }
            const embed = new MessageEmbed() //this is for commmand 幫助 eg. !!幫助 ping
                .setTitle("**指令資料:**")
                .addField(
                    "<:id:985950321975128094>**指令名稱:**",
                    command.name ? `\`\`\`${command.name}\`\`\`` : "\`\`\`這個指令沒有名稱!\`\`\`"
                )
                .addField(
                    "<:editinfo:985950967566569503>**指令說明:**",
                    command.description ?
                    `\`\`\`${command.description}\`\`\`` :
                    "此指令無說明!"
                )
                .addField(
                    "<:key:986059580821868544>**指令權限需求(用戶需要有甚麼權限才能使用):**",
                    command.UserPerms ?
                    `\`\`\`${command.UserPerms}\`\`\`` :
                    "\`\`\`這個指令大家都可以用喔\`\`\`"
                )
                .addField(
                    "<:creativeteaching:986060052949524600>**指令影片教學:**",
                    command.video ?
                    `[__**點我立刻前往教學頁面**__](${command.video})` :
                    "```此指令目前沒有教學```"
                )
                .setFooter(
                    `來自${interaction.user.tag}的查詢`,
                    interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setTimestamp()
                .setColor(color)
            return await interaction.followUp({
                embeds: [embed]
            });
        }

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    },
}; 