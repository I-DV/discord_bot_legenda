const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonStyle, EmbedBuilder } = require("discord.js");
const buttonBuilder = require("@/utils/buttonBuilder");
const dataManager = require("@/utils/dataManager");
const TIMEZONE = process.env["TIMEZONE"];
const moment = require("moment-timezone");
const clientManager = require("../utils/clientManager");
let done;

module.exports = {
    data: new SlashCommandBuilder().setName("start").setDescription("Start bot"),
    async execute(interaction) {
        buttonBuilder.clear();
        for (const [bossName, boss] of Object.entries(dataManager.loadBosses())) {
            buttonBuilder.setButton(boss.id, bossName + " ", ButtonStyle.Danger);
        }
        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription("🔘 Нажмите на кнопку с мини-питом, чтобы активировать таймер. Чтобы выйти введите /end")
            .setFooter({ text: `⌛ Таймер обновляется один раз в 10 секунд.` });

        const messageFromInteractionReply = await interaction.deferReply({ fetchReply: true });
        await interaction.followUp({
            embeds: [embed],
            components: buttonBuilder.build(),
        });

        setInterval(async () => {
            buttonBuilder.clear();
            this.refreshButtons(dataManager.loadBosses(), moment().tz(TIMEZONE).valueOf());
            if (done || !clientManager.getStatus()) return;
            messageFromInteractionReply.edit({
                embeds: [embed],
                components: buttonBuilder.build(),
            });
        }, 10000);
    },
    refreshButtons: function (bosses, timestamp) {
        let count = 0;
        for (const [bossName, boss] of Object.entries(bosses)) {
            const time = boss.next_respawn - timestamp;
            buttonBuilder.setButton(
                boss.id,
                `${bossName} ${
                    time > 0
                        ? `${new Date(time).toISOString().slice(-13, -5)}`
                        : time < 0 && time > -60000
                        ? `${new Date(timestamp - boss.next_respawn).toISOString().slice(-13, -5)}`
                        : ""
                }`,
                time < 60000 ? ButtonStyle.Danger : ButtonStyle.Success
            );
            if (time < -60000) count++;
        }
        done = count === Object.entries(bosses).length;
    },
};
