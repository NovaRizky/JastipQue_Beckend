"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.Product, { foreignKey: "EventId" });
    }
  }
  Event.init(
    {
      name: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg : "name can't null"
          },
          notEmpty: {
            args : true,
            msg : 'name must be filled'
          }
        }
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg : "start event can't null"
          },
          notEmpty: {
            args : true,
            msg : 'start event must be filled'
          }
        }
      },
      finish: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg : "finish event can't null"
          },
          notEmpty: {
            args : true,
            msg : 'finish event must be filled'
          }
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg : "address can't null"
          },
          notEmpty: {
            args : true,
            msg : 'address must be filled'
          }
        }
      },
      mapsUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
