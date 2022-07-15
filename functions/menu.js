const chalk = require(`chalk`);
const {
    MessageSelectMenu,
    MessageActionRow,
    MessageButton
} = require(`discord.js`);

/* MENU CREATOR */
/**
 * @param {Array} array - The array of options (rows to select) for the select menu
 * @returns MessageSelectMenu
 */

const create_mh = (
    array
) => {

    if (!array) throw new Error(chalk.red.bold(`沒有提供選項！確保您提供所有選項!`));
    if (array.length < 0) throw new Error(chalk.red.bold(`你必須必須至少選擇一個清單!`));
    let select_menu;

    let id = `help-menus`;

    let menus = [];

    const emo = {
        管理系統指令: "<:manager:986069915129769994>",
        公告系統指令: "<:megaphone:985943890148327454>",
        私人頻道指令: "<:ticket:985945491093205073>",
        語音包廂指令: "🔉",
        經驗系統指令: "<:level1:985947371957547088>",
        抽獎系統指令: "<:lottery:985946439253381200>",
        統計系統指令: "📊",
        音樂系統指令: "<:music1:985946956591423518>",
        加入設置指令: "🪂",
        驗證系統指令: "<:tickmark:985949769224556614>",
        實用指令資訊: "<:bestpractice:986070549115596950>",
        遊玩時數指令: "<:chronometer:986065703369080884>",
        統計系統指令: "<:statistics:986108146747600928>",
        警告系統指令: "<:warning:985590881698590730>",
        備份系統指令: "<:backup:992010707354783775>",
        扭蛋系統指令: "<:vendingmachine:997374191651274823>",
        自動通知指令: "<:alarmclock:997415306530131980>"
            }

    // now lets run it
    array.forEach(cca => {
        let name = cca;
        let sName = `${name.toUpperCase()}`
        let tName = name.toLowerCase();
        let fName = name.toUpperCase();

        return menus.push({
            label: sName,
            description: `${tName} 命令!`,
            value: fName,
            emoji: emo[tName]
        })
    });
    const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setURL("https://dsc.gg/mhcat")
                    .setStyle("LINK")
                    .setEmoji("<a:catjump:984807173529931837>")
                    .setLabel("邀請我"),
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
    let chicken = new MessageSelectMenu()
        .setCustomId(id)
        .setPlaceholder(`選擇命令類別!`)
        .addOptions(menus)

    select_menu = new MessageActionRow()
        .addComponents(
            chicken
        );


    return {
        smenu: [select_menu,row],
        sid: id
    }
}

module.exports = create_mh;