const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('riffy-player');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const player = new Player(client);

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!play') {
        if (!args.length) return message.reply('❌ Musíš zadat URL nebo název skladby.');
        if (!message.member.voice.channel) return message.reply('❌ Musíš být ve voice kanále.');
        
        const query = args.join(' ');
        const queue = player.createQueue(message.guild.id, {
            metadata: { channel: message.channel }
        });
        
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            return message.reply('❌ Nepodařilo se připojit k voice kanálu.');
        }
        
        const track = await player.search(query, {
            requestedBy: message.author
        }).then(x => x.tracks[0]);
        
        if (!track) return message.reply('❌ Nenalezena žádná skladba.');
        
        queue.play(track);
        message.reply(`🎶 Přehrávám: **${track.title}**`);
    }
    
    else if (command === '!skip') {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('❌ Nic se právě nehraje.');
        queue.skip();
        message.reply('⏭ Přeskočena aktuální skladba.');
    }
    
    else if (command === '!stop') {
        const queue = player.getQueue(message.guild.id);
        if (!queue) return message.reply('❌ Nic se právě nehraje.');
        queue.destroy();
        message.reply('⏹ Stopnul jsem přehrávání.');
    }
    
    else if (command === '!pause') {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('❌ Nic se právě nehraje.');
        queue.setPaused(true);
        message.reply('⏸ Přehrávání bylo pozastaveno.');
    }
    
    else if (command === '!resume') {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('❌ Nic není pozastaveno.');
        queue.setPaused(false);
        message.reply('▶ Přehrávání bylo obnoveno.');
    }
    
    else if (command === '!queue') {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('❌ Žádná skladba ve frontě.');
        message.reply(`📜 Fronta:
${queue.tracks.map((track, i) => `${i + 1}. ${track.title}`).join('\n')}`);
    }
});

client.login(process.env.TOKEN);

