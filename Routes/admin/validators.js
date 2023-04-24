const {check } = require('express-validator');

const userrepo = require('../../Repository/users');

module.exports =  {
    requireEmail : check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid Email')
    .custom(async email => {
        const existinguser = await userrepo.getOne({email});
        if(existinguser){
            throw new Error('Email in use')
        }
    }),
    
    requirePassword : check('password')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Must be between 4 to 20 characters'),
    
    requirePasswordConfirmation : check('passwordConfirmation')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Must be between 4 to 20 characters')
    .custom((passwordConfirmation,{req})=>{
        if(passwordConfirmation !== req.body.password){
            throw new Error('Password Must Match')
        }
    })
}
