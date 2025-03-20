const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Inicializace DisTube
const distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
});

// Eventy pro hudbu
distube
    .on('playSong', (queue, song) => {
        queue.textChannel.send(`▶️ Hraje: **${song.name}** - ${song.formattedDuration}`);
    })
    .on('addSong', (queue, song) => {
        queue.textChannel.send(`✅ Přidána do fronty: **${song.name}**`);
    })
    .on('error', (channel, error) => {
        console.error(error);
        channel.send('❌ Nastala chyba při přehrávání!');
    });

// Slash příkazy
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply({ content: '❌ Musíš být v hlasovém kanálu!', ephemeral: true });
    }

    switch (commandName) {
        case 'play':
            const query = options.getString('song');
            await distube.play(voiceChannel, query, { textChannel: interaction.channel, member: interaction.member });
            interaction.reply({ content: `🔍 Hledám: **${query}**`, ephemeral: true });
            break;

        case 'stop':
            distube.stop(interaction.guild);
            interaction.reply({ content: '⏹️ Hudba zastavena.', ephemeral: true });
            break;

        case 'skip':
            distube.skip(interaction.guild);
            interaction.reply({ content: '⏭️ Přeskakuji skladbu.', ephemeral: true });
            break;

        case 'queue':
            const queue = distube.getQueue(interaction.guild);
            if (!queue) return interaction.reply('🎵 Fronta je prázdná!');
            interaction.reply(`🎶 Fronta:\n${queue.songs.map((song, id) => `${id + 1}. ${song.name}`).join('\n')}`);
            break;
    }
});

// Přihlášení bota
client.login(process.env.TOKEN);
