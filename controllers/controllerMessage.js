const jwt = require('jsonwebtoken')
const {User, Profile, Message, Store, Product, Event, Category} = require("../models")

class ControllerMessage{
    static getAllMessage(req, res, next){
        Message.findAll({include: [User]})
        .then((data) => {
            res.status(200).json({
                message: data
            });
        })
        .catch((err) => {
            next(err)
        })
    }
    // static getAllStore(req, res, next){
    //     Store.findAll({include: [User]})
    //     .then((data) => {
    //         res.status(200).json({
    //             data: data
    //         });
    //     })
    //     .catch((err) => {
    //         next(err)
    //     })
    // }
    // static getAllProduct(req, res, next){
    //     Product.findAll({include: [Store, Event, Category]})
    //     .then((data) => {
    //         res.status(200).json({
    //             data: data
    //         });
    //     })
    //     .catch((err) => {
    //         next(err)
    //     })
    // }
    // static deleteProduct(req, res, next){
    //     const id = req.params.id
    //     Product.destroy({where : {id}, returning : true})
    //     .then(data => {
    //         if(data === null){
    //             next({name : "ERROR_ID_NOT_FOUND"})
    //         }else{
    //             res.status(200).json({
    //                 message : `success delete store`
    //             })
    //         }
    //     })
    //     .catch((err) => {
    //         next(err)
    //     })
    // }
}

module.exports = ControllerMessage