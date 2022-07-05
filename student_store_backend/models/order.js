const db = require('../db');
const { BadRequestError } = require('../utils/errors');

class Order {
    static async listOrdersForUsers(email) {
        const query = `
        SELECT orders.id AS orderId, orders.customer_id AS customerId, order_details.quantity AS quantity,
        product.name AS name, products.price AS price
        FROM orders
        JOIN orders_details ON orders.id = order_details.order_id
        JOIN products ON order_details.product_id = products.id
        WHERE order.customer_id = (SELECT users.id FROM users WHERE email = $1)
        `

        const results = db.query(query, [email.toLowerCase()]);

        return results;
    }

    static async createOrder(cart) {

        const query = `
        INSERT INTO orders (
            customer_id
        )
        VALUES((SELECT id FROM users WHERE email = $1))
        RETURNING id;
        `;

        const results = await db.query(query, [customer.toLowerCase()])
        const orderId = results.rows[0].id;
        const orders = results.rows;

        cart.keys().forEach(async (key) => {
            let quantity = cart[key];
            let productId = key;

            const query = `
            INSERT into order_details (
                order_id,
                quantity,
                product_id
            )
            VALUES($1, $2, $3)
            `

            let results = await db.query(query, [orderId, quantity, productId]);
        })

        return;
    }
}

module.exports = Order;