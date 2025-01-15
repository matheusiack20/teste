const stripe = require('stripe')('sua_chave_secreta_stripe');
const { validateApiKey } = require('./validateApiKey');

async function createCustomer(email, name) {
    return await stripe.customers.create({
        email: email,
        name: name
    });
}

async function createOrder(customerId, items) {
    // Lógica para criar um pedido
    // Exemplo:
    return {
        id: 'order_id',
        customerId: customerId,
        items: items,
        status: 'created'
    };
}

async function generateCardToken(cardDetails) {
    return await stripe.tokens.create({
        card: cardDetails
    });
}

async function createCharge(customerId, amount, currency, source) {
    return await stripe.charges.create({
        amount: amount,
        currency: currency,
        customer: customerId,
        source: source
    });
}

async function checkout(apiKey, email, name, items, cardDetails, amount, currency) {
    if (!validateApiKey(apiKey)) {
        throw new Error('API Key inválida');
    }

    const customer = await createCustomer(email, name);
    const order = await createOrder(customer.id, items);
    const token = await generateCardToken(cardDetails);
    const charge = await createCharge(customer.id, amount, currency, token.id);

    return {
        order: order,
        charge: charge
    };
}

module.exports = {
    checkout
};
