require("module-alias/register");
require("dotenv").config();

const { Events, Collection } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const commandFiles = fs.readdirSync("src/commands").filter((file) => file.endsWith(".js"));
const TOKEN = process.env["LEGENDA_TOKEN"];
const BOT_CHANNEL = process.env["CHANNEL"];
const TIMEZONE = process.env["TIMEZONE"];

const clientManager = require("@/utils/clientManager");
const recordTimeNowAction = require("@/components/recordTimeNowAction");
const dataManager = require("@/utils/dataManager");
const { findChannel } = require("./utils/clientManager");

const client = clientManager.getClient();
let bosses = dataManager.loadBosses();

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`@/commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.login(TOKEN);

client.once("ready", () => {
    console.log("Бот запущен!");
    clientManager.sendMessage(BOT_CHANNEL, `Внимание! Легенда в сети! Для начала работы со мной нужно ввести команду /start`);

    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: "9",
    }).setToken(TOKEN);

    (async () => {
        try {
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env["GUILD_ID"]), {
                body: commands,
            });
            console.log("Команды успешно зарегистрированы");
        } catch (error) {
            if (error) console.error(error);
        }
    })();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const customId = interaction.customId;

    if (customId) {
        Object.keys(bosses).forEach((bossName) => {
            const boss = bosses[bossName];
            if (boss.id === customId) {
                recordTimeNowAction.recordNow(interaction, boss.name, TIMEZONE);
                console.log(`Время для ${bossName} записано`);
            }
        });
    } else {
        await interaction.followUp({
            content: `Неизвестное действие "${customId}"`,
            ephemeral: true,
        });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command || interaction.channel.id !== clientManager.findChannel(BOT_CHANNEL).id) return;
    if (!clientManager.getStatus() && interaction.commandName === "start") {
        clientManager.setStatus(true);
        console.log(`Таймеры запущены`);
    } else if (clientManager.getStatus() && interaction.commandName === "end") {
        clientManager.setStatus(false);
        console.log(`Таймеры выключены`);
        await interaction.reply({ content: "Бот выключен", ephemeral: true });
    } else {
        console.log(`Некорректная команда`);
        await interaction.reply({ content: clientManager.getStatus() ? "Уже запущен" : "Для начала введите /start", ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: "Для начала введите /start", ephemeral: true });
    }
});
