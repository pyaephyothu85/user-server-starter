const UserModel = require('../models/user.model')
const CustomError = require('../utils/CustomError')
const asyncErrorHandler = require('../utils/asyncErrorHandler')

exports.register = asyncErrorHandler(async (req, res, next) => {
    const {name, email, password} = req.body;
    const isEmailExists = await UserModel.findOne({email});
    if(isEmailExists) {
        return next(new CustomError('Email already exists', 400))
    }
    const newUser = await UserModel.create({name, email, password});

    res.status(201).json({
        success: true,
        newUser
    })
})

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password} = req.body;
    if(!email || !password) {
        return next(new CustomError('Enter email and password', 400))
    }

    const user = await UserModel.findOne({email});
    if(!user) {
        return next(new CustomError('Invalid Email', 403))
    }
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new CustomError('Invalid Password', 403))
    }

    const accessToken = await user.SignAccessToken();

    res.status(201).json({
        success: true,
        user,
        accessToken
    })
})