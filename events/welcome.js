const client = require('../index');
const join_role = require('../models/join_role.js')
const join_message = require("../models/join_message.js")
const leave_message = require('../models/leave_message.js')
const {
  MessageActionRow,
  MessageButton,
  Interaction,
  Permissions,
  DiscordAPIError,
  Discord,
  MessageEmbed,
  WebhookClient
} = require('discord.js');
const joinWebhook = new WebhookClient({ url: client.config.joinWebhook })
const leaveWebhook = new WebhookClient({ url: client.config.leaveWebhook })

client.on("guildMemberAdd", (member) => {
  join_role.find({
    guild: member.guild.id,
  }, async (err, data) => {
    if (!data) return
    for (x = data.length - 1; x > -1; x--) {
      let role = member.guild.roles.cache.get(data[x].role)
      const owner = await member.guild.fetchOwner();
      if (Number(role.position) >= Number(member.guild.me.roles.highest.position)) return owner.send("很抱歉，我沒有權限給他加入的成員身分組\n麻煩請將我的身份組位階調高!\n身分組:<@" + role.id + ">")
      member.roles.add(role)
    }
  })
  if (member.guild.id === "976879837471973416") {
    const channel = member.guild.channels.cache.get("977248106234142810")
    const welcome = new MessageEmbed()
      .setAuthor('🪂 歡迎加入 MHCAT!', `${member.guild.me.displayAvatarURL({dynamic: true})}`, 'https://dsc.gg/MHCAT')
      .setDescription(`**<:welcome:978216428794679336> 歡迎 __${member.user.username}#${member.user.discriminator}__ 的加入!
:speech_balloon: <#979307778524979201>想要聊天的話歡迎到這裡!
👾 <#977249272204521532>有任何bug歡迎到這邊回報!

如果有建議或試任何的問題或想法歡迎到\n<#978218954600374272>開啟客服頻道**
    `)
      .setThumbnail(member.displayAvatarURL({
        dynamic: true
      }))
      .setColor("RANDOM")
      .setTimestamp()
    channel.send({
      embeds: [welcome]
    })
  } else {
    join_message.findOne({
      guild: member.guild.id,
    }, async (err, data) => {
      if (!data) {
        return 

      } else {
        const channel = member.guild.channels.cache.get(data.channel)
        if(!channel)return 
        const MEMBER = member.user.username
        const content = data.message_content
        const welcome = new MessageEmbed()
      .setAuthor(`🪂 歡迎加入 ${member.guild.name}!`, `${member.guild.iconURL() === null ? member.guild.me.displayAvatarURL({dynamic: true}) : member.guild.iconURL()}`)
      .setDescription(content.replace("(MEMBERNAME)", MEMBER))
      .setThumbnail(member.displayAvatarURL({
        dynamic: true
      }))
      .setColor(data.color)
      .setTimestamp()
      channel.send({
      embeds: [welcome],
    });
      }
    })
  }
});

client.on("guildMemberRemove", (member) => {
    leave_message.findOne({
      guild: member.guild.id,
    }, async (err, data) => {
      if (!data) {
        return 
      } else {
        const channel = member.guild.channels.cache.get(data.channel)
        if(!channel)return 
        const MEMBER = member.user.username
        const content = data.message_content
        const welcome = new MessageEmbed()
      .setTitle(`${data.title}`)
      .setDescription(content.replace("(MEMBERNAME)", MEMBER))
      .setThumbnail(member.displayAvatarURL({
        dynamic: true
      }))
      .setColor(data.color)
      .setTimestamp()
      channel.send({
      embeds: [welcome],
    });
      }
    })
});
client.on("guildCreate", async (guild) => {
    let embed = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}#${client.user.discriminator} | ${client.user.id}`, iconURL: client.user.displayAvatarURL()})
      .setDescription(`<:joins:956444030487642112> 我加入了 ${guild.name}！`)
      .addFields(
        { name: '伺服器ID', value: `\`${guild.id}\``, inline: true },
        { name: '伺服器擁有者', value: `<@${guild.ownerId}> (\`${guild.ownerId}\`)`, inline: true },
        { name: "伺服器使用者數量", value: `${guild.memberCount}`, inline: true }
      )
      .setColor("#2f3136")
    joinWebhook.send({
      embeds: [embed]
    })
  });

  client.on("guildDelete", async (guild) => {
    let embed = new MessageEmbed()
      .setAuthor({ name: `${client.user.username}#${client.user.discriminator} | ${client.user.id}`, iconURL: client.user.displayAvatarURL()})
      .setDescription(`<:leaves:956444050792280084> 我離開了 ${guild.name}！`)
      .setColor("#2f3136")
    leaveWebhook.send({
      embeds: [embed]
    })
  });