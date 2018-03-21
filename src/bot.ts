import * as dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";
import roll from "./commands/roll";
import * as env from "env-var";

const client : Client = new Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    let name = `<@${client.user.id}>`;
    let tagged = message.content.includes(name);
    let msg = message.content;

    if ((!tagged && !msg.startsWith("!")) || message.author.bot) return;
    
    if(msg.startsWith("!")) msg = msg.substr(1);
    if(tagged) msg = msg.replace(name, "").trim();

    const args = msg.split(/ +/);
    const command: string = args.shift().toLowerCase();

    switch(command) {
        case "roll":
            roll(client, message, args);
            break;
    }
    // other commands...
});

// Discord token for logon as DungeonsBot
const token: string = env.get("DISCORD_TOKEN").required().asString();
client.login(token);