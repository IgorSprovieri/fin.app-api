"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Categories", {
      fields: ["icon_id"],
      type: "foreign key",
      name: "categories_icon_id_fkey",
      references: {
        table: "Icons",
        field: "id",
      },
      onDelete: null,
      onUpdate: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Categories",
      "categories_icon_id_fkey"
    );
  },
};
