import { Client, GatewayIntentBits, Message } from "discord.js";

const token =
  "MTE5NTYyNjYwMzc0MTQ1ODQ4Mg.GAr6bR.oUpRyoYgTQrcJPF6rL0x0s7mY3aqlc0piH7CcI";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(token);

client.on("messageCreate", (msg: Message) => {
  if (msg.author.bot) return;

  if (msg.content === "hello") {
    msg.reply(`Hello! How can I assist you?`);
  }
});
