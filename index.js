const express = require('express');
const bodyParser = require('body-parser');
const userrepo = require('./Repository/users');
const cookieSession = require('cookie-session');
const e = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['ksjbndfaskjdbkjsdasd']
}));

app.get('/signup', (req, res) => {
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

app.post('/signup', async (req, res) => {
    console.log(req.body);
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

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You Are Signed Out')
});

app.get('/signin', (req, res) => {
    res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `);
})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await userrepo.getOne({ email });

    if (!user) {
        return res.send('Email Not Found');
    }

    if (user.password !== user.password) {
        return res.send('Invalid Password');
    }

    req.session.userId = user.Id;

    res.send('You Are signed In!!!!');
})
app.listen(3000, () => {
    console.log('Listening');
});
