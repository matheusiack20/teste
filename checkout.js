import pagarme from 'pagarme';
import { validateApiKey } from './validateApiKey';

export async function createCustomer(apiKey, email, name) {
    return await pagarme.client.connect({ api_key: apiKey }).then(client => {
        return client.customers.create({
            email: email,
            name: name
        });
    });
}

export async function createOrder(apiKey, customerId, items) {
    // Lógica para criar um pedido
    // Exemplo:
    return {
        id: 'order_id',
        customerId: customerId,
        items: items,
        status: 'created'
    };
}

export async function generateCardToken(apiKey, cardDetails) {
    const client = await pagarme.client.connect({ api_key: apiKey });
    return await client.cards.create(cardDetails);
}

export async function createCharge(apiKey, customerId, amount, currency, cardId) {
    const client = await pagarme.client.connect({ api_key: apiKey });
    return await client.transactions.create({
        amount: amount,
        payment_method: 'credit_card',
        card_id: cardId,
        customer: {
            id: customerId
        },
        billing: {
            name: 'Billing Name',
            address: {
                country: 'br',
                state: 'sp',
                city: 'São Paulo',
                neighborhood: 'Bela Vista',
                street: 'Avenida Paulista',
                street_number: '1000',
                zipcode: '01310000'
            }
        }
    });
}

export async function checkout(apiKey, email, name, items, cardDetails, amount, currency) {
    if (!validateApiKey(apiKey)) {
        throw new Error('API Key inválida');
    }

    const customer = await createCustomer(apiKey, email, name);
    const order = await createOrder(apiKey, customer.id, items);
    const card = await generateCardToken(apiKey, cardDetails);
    const charge = await createCharge(apiKey, customer.id, amount, currency, card.id);

    return {
        order: order,
        charge: charge
    };
}
