const {
    MessageEmbed,
} = require('discord.js');
const client = require('../index');
const lotter = require('../models/lotter.js')
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
setInterval(() => {
    lotter.find({
    }, async (err, data) => {
    const date = Math.floor(Date.now() / 1000)
     for(x = data.length-1; x > -1; x--) {
        if(date < data[x].date) return
        if(data[x].end === false) {
            const winner_array = []
            for(y = data[x].howmanywinner -1 ; y > -1; y--){
              const winner = data[x].member[getRandomArbitrary(0, data[x].member.length)]
                if(winner === undefined){
                    y--
                }else{
                    winner_array.push(winner.id)
                }
            }
            const guild = client.guilds.cache.get(data[x].guild);
            if(!guild) data[x].delete();
            let channel = guild.channels.cache.get(data[x].message_channel);
            if(!channel) data[x].delete();
            const winner_embed = new MessageEmbed()
            .setTitle("<:fireworks:994643526820319313> 恭喜中獎者! <:fireworks:994643526820319313>")
            .setDescription(`
            **<:celebration:994643523641024705> 恭喜:**
            <@${winner_array.join('>\n<@')}>
            <:gift:994585975445528576> **抽中:** ${data[x].gift}
            `)
            .setColor(channel.guild.me.displayHexColor)
            .setFooter("沒抽中的我給你一個擁抱")
            channel.send({content: `<@${winner_array.join('><@')}>`, embeds: [winner_embed]})
            data[x].collection.update(({guild: data[x].guild, id: data[x].id}), {$set: {end: true}})
            data[x].save()
         }else{
            if((date - data[x].date) * 1000 > 604800) data[x].delete()
            return
         }
     }
    })
}, 50 * 1000);