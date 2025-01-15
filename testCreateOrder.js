import createOrder from './createOrder';

// Arquivo de teste para a função `createOrder`.

const orderData = {
    customer: {
        name: 'João Silva',
        email: 'joao.silva@example.com'
    },
    items: [
        { id: 1, name: 'Produto 1', price: 100 },
        { id: 2, name: 'Produto 2', price: 200 }
    ],
    total: 300
};

createOrder(orderData)
    .then(order => {
        console.log('Pedido criado:', order);
    })
    .catch(error => {
        console.error('Erro ao criar o pedido:', error);
    });
