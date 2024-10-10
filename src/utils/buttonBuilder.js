const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

let buttonRow = new ActionRowBuilder();
let sortedRow = new ActionRowBuilder();
let buttonRows = [];
module.exports = {
    setButton: function (id, label, style) {
        buttonRow.addComponents(new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(style));
    },

    build: function () {
        if (buttonRow.components.length > 0) {
            buttonRow.components.sort((a, b) => {
                if (a.data.label.split(" ")[1] < b.data.label.split(" ")[1] && a.data.label.split(" ")[1] !== "") return -1;
                if (a.data.label.split(" ")[1] > b.data.label.split(" ")[1] && b.data.label.split(" ")[1] !== "") return 1;
                if (b.data.label.split(" ")[1] === "") return -1;
                if (a.data.label.split(" ")[1] === "") return 1;
                return 0;
            });
            for (const component of buttonRow.components) {
                sortedRow.addComponents(component);
                if (sortedRow.components.length === 5) {
                    buttonRows.push(sortedRow);
                    this.clear();
                }
            }
            if (sortedRow.components.length > 0) {
                buttonRows.push(sortedRow);
                this.clear();
            }
        }
        const rows = buttonRows;
        buttonRows = [];
        buttonRow = new ActionRowBuilder();
        return rows;
    },

    clear: function () {
        sortedRow = new ActionRowBuilder();
    },
};
