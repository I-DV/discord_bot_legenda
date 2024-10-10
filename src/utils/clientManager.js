const { Client, GatewayIntentBits } = require("discord.js");

let isStarted;
let client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

module.exports = {
    getClient: function () {
        return client;
    },

    findChannel: function (chanelName) {
        return client.channels.cache.find((channel) => channel.name === chanelName);
    },

    sendMessage: function (channelName, content) {
        const channel = this.findChannel(channelName);
        if (channel) {
            channel.send({
                content: content,
            });
        } else {
            console.log(`Канал ${channelName} не найден`);
        }
    },

    sendMessage: function (channelName, content, components) {
        const channel = this.findChannel(channelName);
        if (channel) {
            channel.send({
                content: content,
                components: components,
            });
        } else {
            console.log(`Канал ${channelName} не найден`);
        }
    },

    setStatus: function (status) {
        isStarted = status;
    },

    getStatus: function () {
        return isStarted;
    },
};
