import { Client, GatewayIntentBits, Message, TextChannel } from "discord.js";
import { LogDataType } from "../types/loggers";

const { CHANNELID_DISCORD, TOKEN_DISCORD } = process.env;

class LoggerService {
  private client: Client;
  private channelId: string;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    //Add channel Id
    this.channelId = CHANNELID_DISCORD!;

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.login(TOKEN_DISCORD);
  }

  sendToFormatCode(logData: LogDataType) {
    const {
      code,
      message = "This is some information about the code.",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16), //Convert hexadecimal color code to integer
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message: any) {
    const channel = this.client.channels.cache.get(
      this.channelId
    ) as TextChannel;

    if (!channel) {
      console.log(`Cannot find ${this.channelId}!`);
      return;
    }

    channel.send(message).catch((e) => console.log(e));
  }
}

const loggerService = new LoggerService();

export default loggerService;
