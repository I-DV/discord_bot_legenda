const fs = require("fs");

module.exports = {
    //Загружаем данные из файла
    loadData: function (path) {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, "utf8");
            return JSON.parse(data);
        } else {
            return {};
        }
    },

    //Сохраняем данные в файл
    saveData: function (path, data) {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
    },
};
