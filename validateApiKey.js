/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import dotenv from 'dotenv';
import base64 from 'base-64';

dotenv.config();
const apiKey = process.env.PAGARME_API_KEY;
const publicKey = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY;

if (!apiKey || !publicKey) {
  console.error('API key or Public key missing. Check .env file.');
  process.exit(1);
}

const API_KEY = 'sk_test_00828b38f6f0413f8eddc1ae66523cf2'; // Substitua pela sua chave de API válida
const API_URL = 'https://api.pagar.me/core/v5';

// Configuração do Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64.encode(API_KEY + ':')}`,
  },
});

export const createCustomer = async () => {
  const customerData = {
    type: 'individual',
    name: 'Tony Stark',
    email: 'avengerstark@ligadajustica.com.br',
    document_type: 'CPF',
    document: '03154435026',
    gender: 'male',
    birthdate: '1993-09-01',
    phones: {
      home_phone: {
        country_code: '55',
        area_code: '11',
        number: '000000000',
      },
      mobile_phone: {
        country_code: '55',
        area_code: '11',
        number: '000000000',
      },
    },
    address: {
      line_1: '7221, Avenida Dra Ruth Cardoso, Pinheiros',
      line_2: 'Prédio',
      zip_code: '05425070',
      city: 'São Paulo',
      state: 'SP',
      country: 'BR',
    },
    code: '123',
    metadata: {
      company: 'Lannister',
    },
  };

  try {
    console.log('Enviando dados do cliente:', JSON.stringify(customerData, null, 2));
    console.log('Headers:', JSON.stringify(axiosInstance.defaults.headers, null, 2)); // Log dos cabeçalhos

    const response = await axiosInstance.post('/customers', customerData);
    console.log('Cliente criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw new Error('Falha ao criar cliente');
  }
};

export const createOrder = async (customerId) => {
  try {
    const orderData = {
      items: [
        {
          amount: 1000,
          description: 'Produto de teste',
          quantity: 1,
          tangible: true,
          code: 'PRODUTO_TESTE' // Adicione o código do item aqui
        }
      ],
      customer_id: customerId,
      customer: {
        id: customerId,
        name: 'Test User',
        email: 'test@example.com',
        type: 'individual',
        documents: [
          { type: 'cpf', number: '12345678909' }
        ],
        phone_numbers: ['+5511999999999'],
        birthday: '1990-01-01',
        document: '12345678909', // Adicione o documento do cliente aqui
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: '11',
            number: '999999999'
          }
        }
      },
      shipping: {
        name: 'Test User',
        fee: 1000,
        delivery_date: '2025-01-20',
        expedited: true,
        address: {
          country: 'BR',
          state: 'SP',
          city: 'Sao Paulo',
          neighborhood: 'Jardim Paulista',
          street: 'Av. Paulista',
          street_number: '1000',
          zip_code: '01310000'
        },
        description: 'Entrega rápida' // Adicione a descrição do envio aqui
      },
      payments: [
        {
          payment_method: 'credit_card',
          credit_card: {
            installments: 1,
            statement_descriptor: 'Teste',
            card: {
              number: '4111111111111111',
              holder_name: 'Test User',
              exp_month: '12',
              exp_year: '2025',
              cvv: '123',
              billing_address: {
                country: 'BR',
                state: 'SP',
                city: 'Sao Paulo',
                neighborhood: 'Jardim Paulista',
                street: 'Av. Paulista',
                street_number: '1000',
                zip_code: '01310000'
              }
            }
          }
        }
      ],
      billing: { // Adiciona as informações de faturamento
        name: 'Test User',
        address: {
          country: 'BR',
          state: 'SP',
          city: 'Sao Paulo',
          neighborhood: 'Jardim Paulista',
          street: 'Av. Paulista',
          street_number: '1000',
          zip_code: '01310000'
        }
      },
      closed: false, // Garante que o pedido não seja fechado automaticamente
      status: 'open' // Adiciona o status "open" ao pedido
    };

    console.log('Enviando dados do pedido:', JSON.stringify(orderData, null, 2));
    const { data: order } = await axiosInstance.post('/orders', orderData);
    console.log('Order created:', JSON.stringify(order, null, 2));

    if (order.status !== 'open') {
      console.error('Erro: O pedido foi criado com status incorreto:', order.status);
      // Tenta corrigir o status do pedido, se a API permitir
      console.log('Tentando corrigir o status do pedido...');
      // Implementar lógica alternativa aqui, se necessário
    } else {
      console.log('Pedido criado com sucesso com status "open".');
    }

    return order;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const generateCardToken = async () => {
  try {
    const cardData = {
      type: 'card',
      card: {
        number: '4111111111111111', // Cartão de teste que gera sucesso
        holder_name: 'Tyrion Lannister',
        holder_document: '03154435026',
        exp_month: 1,
        exp_year: 30,
        cvv: '123',
        brand: 'Mastercard',
        label: 'Renner',
        billing_address: {
          line_1: '7221, Avenida Dra Ruth Cardoso, Pinheiro',
          line_2: 'Prédio',
          zip_code: '05425070',
          city: 'São Paulo',
          state: 'SP',
          country: 'BR'
        }
      }
    };

    console.log('Enviando dados do cartão:', JSON.stringify(cardData, null, 2));
    const { data: cardTokenResponse } = await axios.post(
      `https://api.pagar.me/core/v5/tokens?appId=${publicKey}`,
      cardData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Card token response:', JSON.stringify(cardTokenResponse, null, 2));

    const cardToken = cardTokenResponse.id;
    console.log('Card token generated:', cardToken);

    return cardToken;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createCharge = async (orderId, cardToken, customerId) => {
  try {
    const chargeData = {
      order_id: orderId,
      customer_id: customerId,
      customer: {
        id: customerId,
        name: 'Test User', // Adiciona o nome do cliente
        email: 'test@example.com',
        type: 'individual',
        documents: [
          { type: 'cpf', number: '12345678909' }
        ],
        phone_numbers: ['+5511999999999'],
        birthday: '1990-01-01',
        document: '12345678909', // Adicione o documento do cliente aqui
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: '11',
            number: '999999999'
          }
        }
      },
      payment: {
        payment_method: 'credit_card',
        credit_card: {
          card_token: cardToken,
          billing_address: {
            country: 'BR',
            state: 'SP',
            city: 'Sao Paulo',
            neighborhood: 'Jardim Paulista',
            street: 'Av. Paulista',
            street_number: '1000',
            zip_code: '01310000'
          }
        }
      },
      billing: { // Adiciona as informações de faturamento
        name: 'Test User',
        address: {
          country: 'BR',
          state: 'SP',
          city: 'Sao Paulo',
          neighborhood: 'Jardim Paulista',
          street: 'Av. Paulista',
          street_number: '1000',
          zip_code: '01310000'
        }
      },
      amount: 1000
    };

    console.log('Enviando dados da cobrança:', JSON.stringify(chargeData, null, 2));
    const { data: charge } = await axiosInstance.post('/charges', chargeData);
    console.log('Charge created:', JSON.stringify(charge, null, 2));

    if (charge.status !== 'paid' || !charge.success) {
      console.error(`Erro: A cobrança foi criada com status incorreto: ${charge.status}`);
      console.log('Tentando corrigir a cobrança...');
      // Tente corrigir a cobrança aqui
    } else {
      // Atualiza o status do pedido para "paid"
      await updateOrderStatus(orderId, 'paid');
    }

    return charge;
  } catch (error) {
    handleAxiosError(error);
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const { data: updatedOrder } = await axiosInstance.put(`/orders/${orderId}`, { status });
    console.log(`Order status updated to ${status}:`, JSON.stringify(updatedOrder, null, 2));
  } catch (error) {
    handleAxiosError(error);
  }
};

const handleAxiosError = (error) => {
  if (error.response) {
    console.error('Erro na resposta da API:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    console.error('Erro na requisição:', error.request);
  } else {
    console.error('Erro desconhecido:', error.message);
  }
};

const getPagarmeErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.errors) {
    return error.response.data.errors.map(err => err.message).join(', ');
  }
  return 'Erro desconhecido';
};

const checkout = async () => {
  try {
    const customer = await createCustomer();
    if (!customer || !customer.id) {
      throw new Error('Failed to create customer.');
    }
    console.log('Customer created:', customer);

    const order = await createOrder(customer.id);
    if (!order || !order.id) {
      throw new Error('Failed to create order.');
    }
    console.log('Order created:', order);

    const cardToken = await generateCardToken();
    if (!cardToken) {
      throw new Error('Failed to generate card token.');
    }
    console.log('Card token generated:', cardToken);

    const charge = await createCharge(order.id, cardToken, customer.id);
    if (!charge || !charge.id) {
      throw new Error('Failed to create charge.');
    }
    console.log('Charge created:', charge);

    // Log dos valores solicitados
    console.log('card_token:', cardToken);
    console.log('customer_id:', customer.id);
    console.log('charge_id:', charge.id); // Adicionando o log do charge_id
    console.log('order_id:', order.id);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

checkout();