const layout = require('../layout');


module.exports = ({ products }) => {
    const renderedProducts = products.map((products) => {
        return `
        <div>${products.title}</div>
        `;
    }).join('')

    return layout({
        content: `
        <h1 class="title"> Products</h1>
        ${renderedProducts}
        `
    })
}