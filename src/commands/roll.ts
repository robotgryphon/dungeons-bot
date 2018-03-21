import { Client, Message, RichEmbed, RichEmbedOptions } from "discord.js";

const diceRegex = /([\d]+)d([\d]+)([\+|\-][\d]+)?/

export default function(client: Client, message: Message, args: string[]) {
    let length: number = args.length;

    if(length == 0) {
        message.channel.send("Invalid format, expected 1d20 format.");
        return;
    }

    // TODO: Configurable?
    if(length > 1) {
        message.channel.send("Can only parse one roll at a time, to prevent large responses.");
        return;
    }

    args.forEach(rollAttempt => tryDiceRoll(client, message, rollAttempt));
}

function doRoll(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tryDiceRoll(client: Client, message: Message, roll: string) {
    let tested = diceRegex.test(roll);
    if(!tested) {
        message.channel.send("Invalid format; expected standard 1d20 format.");
        return;
    }

    let m: any = diceRegex.exec(roll);

    // Parse roll values out
	let numDice = parseInt(m[1]);
	let numSides = parseInt(m[2]);
	let modifier = parseInt(m[3]);
    
    if(numDice > 100) {
        message.channel.send(`**Error:** Cannot roll over \`100\` dice at a time.`);
        return;
    }

    if(numSides > 1000) {
        message.channel.send(`**Error:** Cannot roll a die that has over \`1000\` sides. Really?`);
        return;
    }

	let rolls: number[] = [];
	for(var r = 0; r < numDice; r++) {
		rolls.push(doRoll(1, numSides));
	}
	
	
	let sum = rolls.reduce((a, b) => a + b);
	let total = isNaN(modifier) ? sum : sum + modifier;

    let rollString = rolls.join(", ");
    if(rollString.length > 1000)
        rollString = rollString.substring(0, 1000) + "...";

    const embed = new RichEmbed()
        .setColor(12712177)
        .setFooter(message.author.username, message.author.avatarURL)
        .addField(`🎲 ${roll}`, rollString);

    let boom = "💥";
    if(numDice == 1 && total == 20)
        embed.addField(`${boom} ***CRITICAL!*** ${boom}`, "\u200b");

    message.channel.send(`Total: **${total}**`, { embed });
}