import { startServer } from "./server.js"
import { Client, Intents } from "discord.js"
import fs from 'fs'
import https from 'https'
import dotenv from "dotenv"
dotenv.config()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  disableMentions: 'everyone'
});
const app = startServer(client)

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity('Serving the People');
})

client.login(process.env.DISCORD_BOT_TOKEN)

// Start Web/API server
if (process.env.PRIVKEY && process.env.CERT) {
  https.createServer({
    key: fs.readFileSync(process.env.PRIVKEY),
    cert: fs.readFileSync(process.env.CERT)
  }, app).listen(process.env.PORT || 443, () => {
    console.log('Web/API Server is running on port', process.env.PORT || 443);
  });
} else {
  app.listen(process.env.PORT || 8080, () => {
    console.log('Web/API Server is running on port', process.env.PORT || 8080);
  });
}

