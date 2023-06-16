"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
      this.belongsTo(models.Icons, { foreignKey: "icon_id", as: "icon" });
      this.belongsTo(models.Colors, { foreignKey: "color_id", as: "color" });
    }
  }
  Categories.init(
    {
      user_id: DataTypes.STRING,
      icon_id: DataTypes.INTEGER,
      color_id: DataTypes.INTEGER,
      category: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Categories",
      timestamps: false,
    }
  );
  return Categories;
};
