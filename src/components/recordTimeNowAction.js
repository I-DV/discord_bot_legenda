const moment = require("moment-timezone"); // Импортируем moment-timezone
const bossesData = require("@/dataSources/bosses.json");
const dataManager = require("@/utils/dataManager");

module.exports = {
    recordNow: function (interaction, bossName, timezone) {
        const boss = bossesData[bossName];
        const now = moment().tz(timezone);
        let respawnTime = now.valueOf() + boss.respawn_time;

        interaction.deferUpdate();

        dataManager.updateBoss(bossName, {
            last_respawn: now.valueOf(),
            next_respawn: boss.random_time !== null ? respawnTime + boss.random_time : respawnTime,
            recorded_by: interaction.user.username,
        });
    },
};
