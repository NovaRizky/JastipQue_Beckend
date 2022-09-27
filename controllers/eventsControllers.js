const { User, Event, Product, Category } = require("../models");
const Redis = require("ioredis");
const redis = new Redis({
  host: "redis-13695.c10.us-east-1-4.ec2.cloud.redislabs.com",
  port: 13695,
  password: process.env.passwordRedis,
});

class eventsController {
  static async getEvents(req, res, next) {
    try {
      const cache = await redis.get("events");

      if (cache) {
        res.status(200).json(JSON.parse(cache));
      } else {
        const events = await Event.findAll({
          include: [Product],
        });

        if (events) {
          await redis.set("events", JSON.stringify(events));
        }

        res.status(200).json(events);
      }
    } catch (error) {
      next(error);
    }
  }

  static async createEvents(req, res, next) {
    try {
      await redis.del("products");
      await redis.del("events");
      await redis.get("cus_products");
      await redis.del("cus_events");

      const { name, start, finish, address, mapsUrl } = req.body;

      const event = await Event.create({
        name,
        start,
        finish,
        address,
        mapsUrl,
      });

      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvents(req, res, next) {
    try {
      await redis.del("products");
      await redis.del("events");
      await redis.get("cus_products");
      await redis.del("cus_events");

      const event = await Event.findByPk(+req.params.eventId);
      if (!event) res.status(404).json({ message: "event not found" });

      await Event.destroy({
        where: {
          id: req.params.eventId,
        },
      });

      res.status(200).json({ message: `${event.name} success to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async updateEvents(req, res, next) {
    try {
      await redis.del("products");
      await redis.del("events");
      await redis.get("cus_products");
      await redis.del("cus_events");

      const { name, start, finish, address, mapsUrl } = req.body;

      const find = await Event.findByPk(+req.params.eventId);
      if (!find) res.status(404).json({ message: "event not found" });

      const event = await Event.update(
        {
          name,
          start,
          finish,
          address,
          mapsUrl,
        },
        {
          where: {
            id: req.params.eventId,
          },
          returning: true,
        }
      );
      res.status(200).json(event[1][0]);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = eventsController;
