import axios from 'axios';
import config from './config';

// ...existing code...

const apiKey = config.pagarmeApiKey;

if (!apiKey) {
  console.error('A chave da API não foi fornecida. Verifique o arquivo de configuração.');
  process.exit(1);
}

console.log(`Usando a chave da API: ${apiKey}`);

const createOrder = async () => {
  try {
    console.log("Iniciando criação do pedido...");

    const orderResponse = await axios.post('https://api.pagar.me/core/v5/orders', {
      items: [
        {
          amount: 1000,
          description: 'Produto de teste',
          quantity: 1,
          tangible: true
        }
      ],
      customer: {
        name: 'Test User',
        email: 'test@example.com',
        type: 'individual',
        documents: [
          {
            type: 'cpf',
            number: '00000000000'
          }
        ],
        phone_numbers: ['+5511999999999'],
        birthday: '1970-01-01'
      },
      shipping: {
        name: 'Test User',
        fee: 1000,
        delivery_date: '2021-12-25',
        expedited: true,
        address: {
          country: 'br',
          state: 'sp',
          city: 'Sao Paulo',
          neighborhood: 'Jardim Paulista',
          street: 'Av. Paulista',
          street_number: '1000',
          zipcode: '01310000'
        }
      }
    }, {
      auth: {
        username: apiKey,
        password: ''
      }
    });

    console.log('Pedido criado com sucesso:', orderResponse.data);

    const orderId = orderResponse.data.id;

    console.log("Iniciando criação da cobrança...");

    const chargeResponse = await axios.post('https://api.pagar.me/core/v5/charges', {
      order_id: orderId,
      payment_method: 'credit_card',
      credit_card: {
        card_number: '4111111111111111',
        card_cvv: '123',
        card_expiration_date: '1225',
        card_holder_name: 'Test User',
        billing_address: {
          country: 'br',
          state: 'sp',
          city: 'Sao Paulo',
          neighborhood: 'Jardim Paulista',
          street: 'Av. Paulista',
          street_number: '1000',
          zipcode: '01310000'
        }
      }
    }, {
      auth: {
        username: apiKey,
        password: ''
      }
    });

    console.log('Cobrança criada com sucesso:', chargeResponse.data);

  } catch (error) {
    console.error('Erro ao criar pedido ou cobrança:', error);
    if (error.response) {
      console.error('Status da resposta:', error.response.status);
      console.error('Cabeçalhos da resposta:', error.response.headers);
      console.error('Dados da resposta:', error.response.data);
    } else {
      console.error('Erro sem resposta da API:', error.message);
    }
  }
};

createOrder();

// ...existing code...
