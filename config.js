

module.exports = {
  TOKEN: "",
  language: "en",
  ownerID: ["630827684037132309", ""], 
  mongodbUri : "mongodb+srv://atlas-sample-dataset-load-67db16a67e93545ac1f8e058:<db_password>@cluster0.ek7o2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  spotifyClientId : "",
  spotifyClientSecret : "",
  setupFilePath: './commands/setup.json',
  commandsDir: './commands',  
  embedColor: "#1db954",
  activityName: "YouTube Music", 
  activityType: "https://www.twitch.tv/votrixx__",  // Available activity types : LISTENING , PLAYING
  SupportServer: "https://discord.gg/xQF9f9yUEM",
  embedTimeout: 5, 
  errorLog: "", 
  nodes: [
     {
      name: "GlaceYT",
      password: "glaceyt",
      host: "193.226.78.187",
      port:  9372,
      secure: false
    }
  ]
}
