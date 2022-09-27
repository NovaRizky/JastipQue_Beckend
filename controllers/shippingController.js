const { Shipping } = require("../models/index");

class ShippingController {
  static async viewAllShipping(req, res, next) {
    try {
      const shippings = await Shipping.findAll();
      res.status(200).json(shippings);
    } catch (error) {
      next(error);
    }
  }

  static async createNewShipping(req, res, next) {
    try {
      const { name, type, price } = req.body;
      const shipping = await Shipping.create({
        name,
        type,
        price,
      });

      res.status(201).json({ message: "New Shipping has been created" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteShipping(req, res, next) {
    try {
      const { id } = req.params;
      const shipping = await Shipping.findByPk(id);
      if (!shipping) throw { name: "ShippingNotFound" };
      await Shipping.destroy({ where: { id } });
      res.status(200).json({ message: "Shipping option has been deleted" });
    } catch (error) {
      next(error);
    }
  }

  static async getOneShipping(req, res, next) {
    try {
      const { id } = req.params;
      const shipping = await Shipping.findByPk(id);
      if (!shipping) throw { name: "ShippingNotFound" };
      res.status(200).json(shipping);
    } catch (error) {
      next(error);
    }
  }

  static async editShipping(req, res, next) {
    try {
      const { id } = req.params;
      const { name, type, price } = req.body;

      const shippingCheck = await Shipping.findByPk(id);

      if (!shippingCheck) throw { name: "ShippingNotFound" };

      const shipping = await Shipping.update(
        {
          name,
          type,
          price,
        },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).json({ message: "Shipping option has been edited" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ShippingController;
