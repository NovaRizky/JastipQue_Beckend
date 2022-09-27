const jwt = require("jsonwebtoken");
const { User, Profile, Message } = require("../models");
const { decrypt } = require("../helpers/bcrypt");
const { OAuth2Client } = require("google-auth-library");
const sendMail = require("../helpers/nodemailer");
const { Op } = require("sequelize");
const { sign } = require("../helpers/jwt");

class ControllerUser {
  static register(req, res, next) {
    const { username, email, password } = req.body;
    const subject = "Welcome to JastipQue";
    const text = "Registration has been successful, thank you";
    User.create({
      username,
      email,
      password,
      role: "admin",
    })
      .then((data) => {
        sendMail(email, subject, text);
        res.status(201).json({
          success: true,
          message: "Register Success",
        });
      })
      .catch((err) => {
        // if(err.name === 'SequelizeValidationError'){
        //     console.log(err)
        //   let errToSend = err.errors.map(el => el.message)
        //   console.log(errToSend, "=========");
        //     next({status:400, message: errToSend})
        // }else{
        next(err);
        // }
      });
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw { name: "LOGIN_BAD_REQUEST" };
    } else {
      User.findOne({
        where: {
          [Op.and]: [{ email: email }, { role: "admin" }],
        },
      })
        .then((user) => {
          if (user && decrypt(password, user.password)) {
            const access_token = sign({ id: user.id, username: user.username, role: user.role });
            res.status(200).json({ success: true, message: "login success", access_token, id: user.id, role: user.role, username: user.username });
          } else {
            throw { name: "WRONG_EMAIL_AND_PW" };
          }
        })
        .catch((err) => {
          next(err);
        });
    }
  }
  static registerCustomer(req, res, next) {
    const { username, email, password } = req.body;
    const subject = "Welcome to JastipQue";
    const text = "Registration has been successful, thank you";
    User.create({ username, email, password, role: "customer" })
      .then((data) => {
        sendMail(email, subject, text);
        res.status(201).json({
          success: true,
          message: "Register Success",
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static loginCustomer(req, res, next) {
    const { email, password } = req.body;
    User.findOne({
      where: {
        [Op.and]: [{ email: email }, { role: "customer" }],
      },
    })
      .then((user) => {
        if (user === null) {
          throw { name: "EMAIL_INVALID" };
        }
        let validatePass = decrypt(password, user.password);
        if (user && validatePass) {
          const access_token = sign({ id: user.id, username: user.username, role: user.role });
          res.status(200).json({ success: true, message: "login success", access_token, id: user.id, role: user.role });
        } else {
          throw { name: "WRONG_EMAIL_AND_PW" };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static showUser(req, res, next) {
    User.findAll()
      .then((data) => {
        res.status(200).json({
          users: data,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static googleLogin(req, res, next) {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const { token_google } = req.body;
    let payload = "";

    client
      .verifyIdToken({
        idToken: token_google,
        audience: process.env.CLIENT_ID,
      })
      .then((ticket) => {
        payload = ticket.getPayload();
        return User.findOne({
          where: { email: payload.email },
        });
      })
      .then((user) => {
        if (!user) {
          return User.create({
            username: payload.name,
            email: payload.email,
            password: Math.random() * 1000 + "abcdefghij",
            role: "customer",
          });
        } else {
          return user;
        }
      })
      .then((user) => {
        const subject = "Welcome to JastipQue";
        const text = "Registration has been successful, thank you";
        if (user) {
          sendMail(user.email, subject, text);
          const access_token = jwt.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET
          );
          res.status(200).json({
            success: true,
            message: "success signup or signin",
            access_token,
            role: user.role,
          });
        }
      })
      .catch((err) => {
        next(err)
      });
  }
}

module.exports = ControllerUser;
