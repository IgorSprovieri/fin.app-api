"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Finances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
      this.belongsTo(models.Categories, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  Finances.init(
    {
      user_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      date: DataTypes.DATE,
      name: DataTypes.STRING,
      value: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Finances",
      timestamps: false,
    }
  );
  return Finances;
};
