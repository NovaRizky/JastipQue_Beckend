const { Order, OrderHeader, Product } = require("../models/index");
const { Op } = require("sequelize");
const { calculateGrossAmount } = require("../helpers/priceCalculator");

class OrderController {
  static async postOrder(req, res, next) {
    try {
      const { quantity, note, ProductId } = req.body;

      const product = await Product.findByPk(ProductId);

      if (!product) throw { name: "ProductNotFound" };
      if (product.stock === 0) throw { name: "ProductNotAvailable" };

      const orderCreate = await Order.create({
        quantity,
        totalPrice: calculateGrossAmount(product.price, quantity),
        note,
        ProductId,
        UserId: req.user.id,
        status: "Open",
      });

      res.status(201).json({ message: "Order has been successfully created!" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) throw { name: "OrderNotFound" };

      const orderDelete = await Order.destroy({
        where: {
          id: id,
        },
      });

      res.status(200).json({ message: "Order has been deleted!" });
    } catch (error) {
      next(error);
    }
  }

  static async editOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity, note } = req.body;

      const order = await Order.findByPk(id);

      if (!order) throw { name: "OrderNotFound" };

      const product = await Product.findByPk(order.ProductId);

      if (!product) throw { name: "ProductNotFound" };

      const orderEdit = await Order.update(
        {
          quantity,
          totalPrice: calculateGrossAmount(product.price, quantity),
          note,
          ProductId: order.ProductId,
        },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).json({ message: "Order has been edited" });
    } catch (error) {
      next(error);
    }
  }

  static async viewAllOrder(req, res, next) {
    try {
      const orders = await Order.findAll({
        where: {
          [Op.and]: {
            UserId: req.user.id,
            status: "Open",
          },
        },
        include: Product,
      });

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
