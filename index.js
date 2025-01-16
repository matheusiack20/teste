import pagarme from 'pagarme';
import config from './config';
import { createClient } from './apiClient';

console.log('Usando a chave da API:', config.pagarmeApiKey);

// ...existing code...

async function processPayment(transactionData) {
  try {
    console.log('Chave da API:', config.pagarmeApiKey);
    const client = await pagarme.client.connect({ api_key: config.pagarmeApiKey });
    console.log('Cliente conectado:', client);
    const transaction = await client.transactions.create(transactionData);
    console.log('Pagamento processado com sucesso:', transaction);
  } catch (error) {
    console.error('Erro ao processar o pagamento:', error);
    if (error.response) {
      console.error('Detalhes do erro da API:', error.response);
    }
  }
}

async function handleCreateClient() {
  const clientData = {
    external_id: '#123456789',
    name: 'Nome do Cliente',
    type: 'individual',
    country: 'br',
    email: 'cliente@example.com',
    documents: [
      {
        type: 'cpf',
        number: '12345678909'
      }
    ],
    phone_numbers: ['+5511999999999'],
    birthday: '1985-01-01'
  };

  try {
    const result = await createClient(clientData);
    console.log('Cliente criado com sucesso:', result);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
  }
}

// Exemplo de dados da transação
const transactionData = {
  amount: 1000,
  card_number: '4111111111111111',
  card_cvv: '123',
  card_expiration_date: '1225',
  card_holder_name: 'Nome do Titular',
  customer: {
    external_id: '#123456789',
    name: 'Nome do Cliente',
    type: 'individual',
    country: 'br',
    email: 'cliente@example.com',
    documents: [
      {
        type: 'cpf',
        number: '12345678909'
      }
    ],
    phone_numbers: ['+5511999999999'],
    birthday: '1985-01-01'
  },
  billing: {
    name: 'Nome do Cliente',
    address: {
      country: 'br',
      state: 'sp',
      city: 'São Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      street_number: '123',
      zipcode: '01001000'
    }
  },
  shipping: {
    name: 'Nome do Cliente',
    fee: 1000,
    delivery_date: '2021-12-31',
    expedited: true,
    address: {
      country: 'br',
      state: 'sp',
      city: 'São Paulo',
      neighborhood: 'Bairro',
      street: 'Rua',
      street_number: '123',
      zipcode: '01001000'
    }
  },
  items: [
    {
      id: '1',
      title: 'Produto 1',
      unit_price: 1000,
      quantity: 1,
      tangible: true
    }
  ]
};

handleCreateClient();
processPayment(transactionData);

// ...existing code...
