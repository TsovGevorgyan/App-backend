'use strict';
const { Model } = require('sequelize');
const { afterDestroy } = require('../modelMiddlware/file');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { File, Product } = models;

      File.belongsTo(Product, {
        foreignKey: 'fileableId',
        constraints: false,
      });
    }
  }
  File.init(
    {
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileableType: {
        type: DataTypes.STRING,
      },
      fileableId: {
        type: DataTypes.INTEGER,
        references: null,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      src: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'File',
    }
  );
  File.afterDestroy(afterDestroy);
  return File;
};
