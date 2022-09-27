const { Product, User, Event, Category, Store } = require("../models");
const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-13695.c10.us-east-1-4.ec2.cloud.redislabs.com",
  port: 13695,
  password: process.env.passwordRedis,
});

const fs = require("fs").promises;
const ImageKit = require("imagekit");
const imagekit = new ImageKit({
  urlEndpoint: process.env.UrlImageKit,
  publicKey: process.env.PublicKeyImageKit,
  privateKey: process.env.PrivateKeyImageKit,
});

class productsControllers {
  static async showAllProducts(req, res, next) {
    try {
      const cache = await redis.get("products");
      if (cache) {
        res.status(200).json(JSON.parse(cache));
      } else {
        const products = await Product.findAll({
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
          await redis.set("products", JSON.stringify(products));
        }

        res.status(200).json(products);
      }
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
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
      if (!product) throw { name: "ProductNotFound" };
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProducts(req, res, next) {
    try {
      await redis.del("products");
      await redis.del("events");
      await redis.get("cus_products");
      await redis.del("cus_events");

      const { name, description, status, image, price, stock, weight, CategoryId, EventId } = req.body;

      if (req.file) {
        const buffer = await fs.readFile("uploads/" + req.file.filename);
        imagekit.upload(
          {
            file: buffer,
            fileName: req.file.originalname,
            folder: "imgJastip",
          },
          function (err, response) {
            Product.create({
              name,
              description,
              imageUrl: response.url,
              status,
              price,
              stock,
              weight,
              CategoryId,
              EventId,
              StoreId: req.user.Store.id,
            })
              .then((products) => {
                res.status(201).json(products);
              })
              .catch(() => {
                return res.status(500).json({ status: "failed" });
              });
          }
        );
      } else {
        const products = await Product.create({
          name,
          description,
          imageUrl: image,
          status,
          price,
          stock,
          weight,
          CategoryId,
          EventId,
          StoreId: req.user.Store.id,
        });
        res.status(201).json(products);
      }

      // res.status(200).json({ status: "success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      await redis.del("products");
      await redis.del("events");
      await redis.get("cus_products");
      await redis.del("cus_events");

      const { name, description, image, status, price, stock, CategoryId, EventId, StoreId } = req.body;

      const find = await Product.findByPk(+req.params.productId);
      if (!find) throw { name: "ProductNotFound" };

      if (req.file) {
        const buffer = await fs.readFile("uploads/" + req.file.filename);
        imagekit.upload(
          {
            file: buffer,
            fileName: req.file.originalname,
            folder: "imgJastip",
          },
          function (err, response) {
            Product.update(
              {
                name,
                description,
                imageUrl: response.url,
                status,
                price,
                stock,
                CategoryId,
                EventId,
                StoreId,
              },
              {
                where: {
                  id: req.params.productId,
                },
                returning: true,
              }
            )
              .then((product) => {
                res.status(200).json(product[1][0]);
              })
              .catch(() => {
                return res.status(500).json({ status: "failed" });
              });
          }
        );
      } else {
        const product = await Product.update(
          {
            name,
            description,
            imageUrl: image,
            status,
            price,
            stock,
            CategoryId,
            EventId,
            StoreId,
          },
          {
            where: {
              id: req.params.productId,
            },
            returning: true,
          }
        );
        res.status(200).json(product[1][0]);
      }
      // res.status(200).json({ status: "success" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      await redis.del("products");
      await redis.del("events");
      await redis.get("cus_products");
      await redis.del("cus_events");

      const product = await Product.findByPk(+req.params.productId);
      if (!product) throw { name: "ProductNotFound" };

      await Product.update(
        {
          status: "Archived",
        },
        {
          where: {
            id: req.params.productId,
          },
        }
      );

      res.status(200).json({ message: `${product.name} success to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async patchStatus(req, res, next) {
    try {
      await redis.del("products");
      await redis.del("events");
      await redis.get("cus_products");
      await redis.del("cus_events");

      const product = await Product.findByPk(+req.params.productId);

      if (!product) {
        throw { name: "ProductNotFound" };
      } else {
        await Product.update(
          {
            status: req.body.status,
          },
          {
            where: {
              id: req.params.productId,
            },
            returning: true,
          }
        );

        res.status(200).json({ message: `status ${product.name} was updated` });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = productsControllers;
