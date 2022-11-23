const { Client, GatewayIntentBits, Events } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
]});
const { prefix, token, CLIENT_ID } = require('./config.json');

client.on(Events.MessageCreate, (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot ) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "shuffle") {
        const userMentions = message.mentions.members;
        const users = [...new Set(userMentions)];

        if (users.length <= 1) {
            return message.channel.send("You must have at least 2 mentions to start the shuffle.");
        }

        else {
            const pairs = getPairs(users);
            pairs.forEach(function(key, value) {
                // user member objects are made up of `[ID, GUILD_MEMBER]`
                client.users.send(key[0], "I'm so sorry. It's been a long day and discord changed a ton of their API recently. Get a gift for: " + value[1].user.username);
            });

            return message.channel.send("The santas have been sent. Enjoy!");
        }
    }
});

function getPairs(users) {
    let partners = users.slice(0);
    shuffle(partners);
    enforceEquity(users, partners);

    let pairs = new Map();

    for(let i = 0; i < users.length; i++) {
        pairs.set(users[i], partners[i]);
    }

    return pairs;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// make sure primaries and partners are not the same
function enforceEquity(primaries, partners) {
    for (let i=0; i < primaries.length; i++) {
        if (primaries[i] === partners[i]) {
            let j = (i + 1) % primaries.length;
            [partners[i], partners[j]] = [partners[j], partners[i]];
        }
    }
}

client.login(token);
