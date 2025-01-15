function processOrder(order) {
    // Verificar se o pedido está fechado
    if (order.closed) {
        notifyImportant(`Order ${order.id} closed. Cannot proceed.`);
        notifyUser(order);
        logOrderStatus(order);
        return;
    }

    // ...existing code to process the order...

    notifyImportant(`Order ${order.id} processed.`);
}

function notifyUser(order) {
    // Função para notificar o usuário
    console.log(`User notified: Order ${order.id} closed.`);
}

function logOrderStatus(order) {
    // Função para registrar o status do pedido
    console.log(`Status logged: Order ${order.id} closed.`);
}

function notifyImportant(message) {
    // Função para tratar notificações importantes
    console.log(`IMPORTANT: ${message}`);
}

// Exemplo de uso
const order = {
    // ...existing order data...
    closed: true,
    id: "or_jxVWq14ipieBge5Z",
    customer: {
        name: "Test User",
        email: "test@example.com"
    }
    // ...existing order data...
};

processOrder(order);
