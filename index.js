const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot ) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "shuffle") {
        if (args.length === 1) {
            return message.channel.send("You can't have a secret santa with a single person.");
        }
        else {
            let users = [...new Set(args)];
            let pairs = {};

            pairs = getPairs(users);
            msg = ""
            console.log(pairs);

            return message.channel.send(pairs);
        }
    }
});

function getPairs(users) {
    let partners = users.slice(0);
    shuffle(partners);
    enforceEquity(users, partners);

    pairs = {};

    for(let i = 0; i < users.length; i++) {
        pairs[users[i]] = partners[i];
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
            console.log(partners);
            console.log(j);
            [partners[i], partners[j]] = [partners[j], partners[i]];
            console.log(partners);
        }
    }
}

client.login(token);