const express = require('express');
const {check , validationResult } = require('express-validator');
const userrepo = require('../../Repository/users');
const signupTemplate = require('../../Views/admin/auth/signup');
const signinTemplate = require('../../Views/admin/auth/signin');
const {requireEmail,requirePassword,requirePasswordConfirmation} = require('./validators');


const router = express.Router();


router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup',[requireEmail,requirePassword,requirePasswordConfirmation],
async (req, res) => {
    
    const errors = validationResult(req);
    console.log(errors);

    const { email, password, passwordConfirmation } = req.body;

    const existinguser = await userrepo.getOne(email);
    if (existinguser) {
        return res.send('Email already exists');
    }
    if (password !== passwordConfirmation) {
        return res.send('Passwords dont match')
    }

    const user = await userrepo.create({ email: email, password: password });

    req.session.userId = user.Id
    res.send('Account created!!!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You Are Signed Out')
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await userrepo.getOne(email);

    if (!user) {
        return res.send('Email Not Found');
    }

    const validPassword = await userrepo.comparePasswords(user.password,password);

    if (!validPassword) {
        return res.send('Invalid Password');
    }

    req.session.userId = user.Id;

    res.send('You Are signed In!!!!');
});


module.exports = router;