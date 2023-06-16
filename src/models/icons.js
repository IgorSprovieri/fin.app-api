"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Icons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Categories, {
        foreignKey: "icon_id",
      });
    }
  }
  Icons.init(
    {
      icon_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Icons",
      timestamps: false,
    }
  );
  return Icons;
};
