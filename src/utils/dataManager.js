const parser = require("@/utils/jsonParser");
const path = "src/dataSources/bosses.json";
let bossesCache = parser.loadData(path);
let isValid = false;

module.exports = {
    // Загрузка данных из файла
    loadBosses: function () {
        if (isValid) {
            return bossesCache;
        } else {
            this.bossesCache = parser.loadData(path);
            isValid = true;
            return bossesCache;
        }
    },

    // Сохранение данных в файл
    saveBosses: function (bosses) {
        parser.saveData(path, bosses);
        isValid = false;
    },

    // Получение данных о конкретном боссеА
    getBoss: function (bossName) {
        const bosses = this.loadBosses();
        return bosses[bossName] || null;
    },

    // Обновление данных о боссе
    updateBoss: function (bossName, updatedData) {
        const bosses = this.loadBosses();
        bosses[bossName] = { ...bosses[bossName], ...updatedData };
        this.saveBosses(bosses);
    },
};
