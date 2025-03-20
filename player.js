const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioPlayer } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { prefix, token } = require('./config.json');  // Zde můžeš nastavit prefix a token pro bota

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', () => {
    console.log('Bot je online!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith(`${prefix}play`)) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Musíš být ve voice channelu!');
        
        const args = message.content.split(' ').slice(1);
        const songUrl = args.join(' ');

        if (!songUrl) return message.reply('Dej mi prosím odkaz na video na YouTube!');

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            const stream = ytdl(songUrl, { filter: 'audioonly' });
            const resource = createAudioResource(stream);
            const player = createAudioPlayer();

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

            message.reply(`Přehrávám hudbu z: ${songUrl}`);
        } catch (error) {
            console.error(error);
            message.reply('Nastala chyba při přehrávání!');
        }
    }
});

client.login(token);
