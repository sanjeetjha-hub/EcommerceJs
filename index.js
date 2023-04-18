const express = require('express');
const bodyParser = require('body-parser');
const userrepo = require('./Repository/users')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/', async (req, res) => {
    console.log(req.body);
    const {email,password,passwordConfirmation}= req.body;

    const existinguser = await userrepo.getOne(email);
    if(existinguser){
      return res.send('Email already exists');  
    }
    if(password !== passwordConfirmation){
      return res.send('Passwords dont match')
    }
    res.send('Account created!!!');
});

app.listen(3000, () => {
    console.log('Listening');
});
