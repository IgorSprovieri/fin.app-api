"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Users", "Users_name_key");
    await queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "name", {
      type: Sequelize.STRING,
      unique: true,
    });
    await queryInterface.removeConstraint("Users", "Users_email_key");
  },
};
