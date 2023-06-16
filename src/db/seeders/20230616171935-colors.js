"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Colors", [
      { hexColor: "#DDDDDD" },
      { hexColor: "#FFEAC8" },
      { hexColor: "#EBE3FC" },
      { hexColor: "#FFE9F5" },
      { hexColor: "#D9F2FF" },
      { hexColor: "#FFD9D9" },
      { hexColor: "#CEF5CA" },
      { hexColor: "#BAD9FE" },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
