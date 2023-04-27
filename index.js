const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./Routes/admin/products');

const app = express();

app.use(express.static('public'));                                                                     // is to make the public folder public so that we can send it
app.use(bodyParser.urlencoded({ extended: true }));                                                     // to parse the body 
app.use(
  cookieSession({
    keys: ['lkasld235j']
  })
);

app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log('Listening');
});


