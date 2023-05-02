const repositories = require('./repository');

class cartsRepository extends repositories {

}


module.exports = new cartsRepository('carts.json');