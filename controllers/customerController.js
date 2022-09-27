const { Product, Category, Event, User, Store } = require("../models");
const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-13695.c10.us-east-1-4.ec2.cloud.redislabs.com",
  port: 13695,
  password: process.env.passwordRedis,
});

class customerController {
  static async getProducts(req, res, next) {
    try {
      const cache = await redis.get("cus_products");
      if (cache) {
        res.status(200).json(JSON.parse(cache));
      } else {
        const products = await Product.findAll({
          where: {
            status: "Active",
          },
          include: [
            {
              model: Store,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: Category,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            Event,
          ],
          order: [["status"], ["id", "DESC"]],
        });
        if (products) {
          await redis.set("cus_products", JSON.stringify(products));
        }

        res.status(200).json(products);
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async getEvents(req, res, next) {
    try {
      const cache = await redis.get("cus_events");
      if (cache) {
        res.status(200).json(JSON.parse(cache));
      } else {
        const events = await Event.findAll({
          include: [
            {
              //jika where diletakkan di luar attribute maka yang akan muncul adalah event dengan produts active saja
              model: Product,
              attributes: {
                where: {
                  status: "Active",
                },
              },
            },
          ],
          order: [["start", "DESC"]],
        });
        if (events) {
          await redis.set("cus_events", JSON.stringify(events));
        }

        res.status(200).json(events);
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async detailProduct(req, res, next) {
    try {
      const product = await Product.findByPk(req.params.productId, {
        include: [
          {
            model: Store,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Category,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          Event,
        ],
      });
      if (!product) res.status(404).json({ message: "Product Not Found" });
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = customerController;
