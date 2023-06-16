"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      icon_id: {
        type: Sequelize.INTEGER,
        references: { model: "Icons", key: "id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      color_id: {
        type: Sequelize.INTEGER,
        references: { model: "Colors", key: "id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      category: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Categories");
  },
};
