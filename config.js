

module.exports = {
  TOKEN: "OTAzNTcwNzI0MTgxMTM5NDk2.GwosX9.P9gOYWRC4qOsRTsmVz7ITQdqERwUwD5aeSkukg",
  language: "en",
  ownerID: ["1004206704994566164", ""], 
  mongodbUri : "mongodb+srv://atlas-sample-dataset-load-67db16a67e93545ac1f8e058:<db_password>@cluster0.ek7o2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  spotifyClientId : "",
  spotifyClientSecret : "",
  setupFilePath: './commands/setup.json',
  commandsDir: './commands',  
  embedColor: "#1db954",
  activityName: "YouTube Music", 
  activityType: "LISTENING",  // Available activity types : LISTENING , PLAYING
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
