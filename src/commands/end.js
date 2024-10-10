const { SlashCommandBuilder } = require("@discordjs/builders");
const clientManager = require("@/utils/clientManager");

module.exports = {
    data: new SlashCommandBuilder().setName("end").setDescription("Shut down bot"),
    async execute(interaction) {
        const channel = interaction.channel;
        let deleted;
        do {
            deleted = await channel.bulkDelete(99);
        } while (deleted.size != 0);
        clientManager.sendMessage(channel.name, `Внимание! Легенда в сети! Для начала работы со мной нужно ввести команду /start`);
    },
};
