"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Colors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Categories, {
        foreignKey: "color_id",
      });
    }
  }
  Colors.init(
    {
      hexColor: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Colors",
      timestamps: false,
    }
  );
  return Colors;
};
