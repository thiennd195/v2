const route = require('express').Router()
const User = require('../models/User')
const { body, validationResult } = require("express-validator");

const bcrypt = require('bcrypt')


route.post('/register', [
    body('fullname').not().isEmpty().withMessage('empty_fullname'),
    body('email').isEmail().withMessage('invalid_email')
    // body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    // .withMessage('weak_password'),
    // body("rePassword").custom(
    //     (value, { req, loc, path }) => {
    //         if (value !== req.body.password) {
    //             throw new Error('password_notmatch');
    //         } else {
    //             return value;
    //         }
    //     }
    // ),
], async (req, res) => {
    try {
        const validatorErrors = validationResult(req);
        if (!validatorErrors.isEmpty()) {
            console.log(validatorErrors.array())
            return res.status(400).send(validatorErrors.array());
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            fullname:req.body.fullname, 
            email: req.body.email,
            password: hashedPassword
        })
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
})

//login

route.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email:req.body.email})
       
        !user&&res.status(404).json("User not found")

        const validPassword = await bcrypt.compare(req.body.password,user.password)
        !validPassword&& res.status(400).json({message:"Password incorrect!"})

        res.status(200).json({user:user})
        
    } catch (error) {
        res.status(500).json('Server error')
        console.log(error)

    }
})

module.exports = route