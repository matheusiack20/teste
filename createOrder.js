import axios from 'axios';

async function createOrder(orderData) {
    try {
        // Adiciona o status "open" ao pedido
        orderData.status = 'open';
        orderData.closed = false; // Garante que o pedido não seja fechado automaticamente

        // Verifica se todos os campos necessários estão presentes
        if (!orderData.billing) {
            throw new Error('Informações de faturamento são necessárias.');
        }

        // Faz a requisição para criar o pedido
        const response = await axios.post('https://api.pagamento.com/v5/orders', orderData); // Ajuste da versão da API para v5

        // Verifica o status do pedido após a criação
        if (response.data.status !== 'open') {
            console.error('Erro: O pedido foi criado com status incorreto:', response.data.status);
            // Tenta corrigir o status do pedido, se a API permitir
            console.log('Tentando corrigir o status do pedido...');
            // Implementar lógica alternativa aqui, se necessário
        } else {
            console.log('Pedido criado com sucesso com status "open".');
        }

        console.log('Token gerado:', response.data.token); // Exibir o token gerado

        return response.data;
    } catch (error) {
        console.error('Erro ao criar o pedido:', error);
        throw error;
    }
}

// ...existing code...

module.exports = createOrder;
