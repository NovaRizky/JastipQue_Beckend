const { User, Profile, Message } = require("../models");

class ControllerProfile {
  static getAllProfile(req, res, next) {
    Profile.findAll({ include: [User] })
      .then((data) => {
        res.status(200).json({
          profile: data,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static addProfile(req, res, next) {
    const { firstName, lastName, birthDate, gender, address, phoneNumber } = req.body;
    Profile.findOne({ where: { UserId: req.userId } })
      .then((profile) => {
        if (profile) {
          throw { name: "ProfileAlreadyExists" };
        } else {
          return Profile.create({ firstName, lastName, birthDate, gender, address, phoneNumber, UserId: req.user.id }, { include: [{ model: User }] });
        }
      })
      .then((data) => {
        res.status(201).json({
          success: true,
          message: "Add Profile Success",
          profile: data,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static getOneProfile(req, res, next) {
    Profile.findOne({ where: { UserId: req.user.id } }, { include: [User] })
      .then((data) => {
        res.status(200).json({
          data,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateProfile(req, res, next) {
    const id = +req.params.id;
    const { firstName, lastName, birthDate, gender, address, phoneNumber } = req.body;
    const UserId = req.userId;
    Profile.update({ firstName, lastName, birthDate, gender, address, phoneNumber, UserId }, { where: { id }, returning: true })
      .then((data) => {
        res.status(200).json({
          message: "success update data",
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteProfile(req, res, next) {
    const id = req.params.id;
    Profile.destroy({ where: { id }, returning: true })
      .then((data) => {
        if (data === null) {
          next({ name: "ERROR_ID_NOT_FOUND" });
        } else {
          res.status(200).json({
            message: `success delete Profile`,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ControllerProfile;
