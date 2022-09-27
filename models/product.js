"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Order, { foreignKey: "ProductId" });
      Product.belongsTo(models.Category);
      Product.belongsTo(models.Event);
      Product.belongsTo(models.Store);
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg : "descripton can't null"
          },
          notEmpty: {
            args : true,
            msg : 'description must be filled'
          }
        }
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg : "image can't null"
          },
          notEmpty: {
            args : true,
            msg : 'image must be filled'
          }
        }
      },
      status: DataTypes.STRING,
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg : "price can't null"
          },
          notEmpty: {
            args : true,
            msg : 'price must be filled'
          }
        }
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg : "weight can't null"
          },
          notEmpty: {
            args : true,
            msg : 'weight must be filled'
          }
        }
      },
      stock: DataTypes.INTEGER,
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg : "category can't null"
          },
          notEmpty: {
            args : true,
            msg : 'category must be filled'
          }
        }
      },
      EventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg : "event can't null"
          },
          notEmpty: {
            args : true,
            msg : 'event must be filled'
          }
        }
      },
      StoreId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
