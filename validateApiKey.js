import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.PAGARME_API_KEY;
const publicKey = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY;

if (!apiKey || !publicKey) {
  console.error('API key or Public key missing. Check .env file.');
  process.exit(1);
}

const axiosInstance = axios.create({
  baseURL: 'https://api.pagar.me/core/v5', // Ajuste da versão da API para v5
  auth: {
    username: apiKey,
    password: ''
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createCustomer = async () => {
  try {
    const customerData = {
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
    };

    console.log('Enviando dados do cliente:', JSON.stringify(customerData, null, 2));
    const { data: customer } = await axiosInstance.post('/customers', customerData);
    console.log('Customer created:', JSON.stringify(customer, null, 2));

    return customer;
  } catch (error) {
    handleAxiosError(error);
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
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    if (error.response.data && error.response.data.gateway_response) {
      console.error('Gateway response errors:', JSON.stringify(error.response.data.gateway_response.errors, null, 2));
    }
  }
};

const checkout = async () => {
  try {
    const customer = await createCustomer();
    console.log('Customer created:', customer);

    const order = await createOrder(customer.id);
    console.log('Order created:', order);

    const cardToken = await generateCardToken();
    console.log('Card token generated:', cardToken);

    const charge = await createCharge(order.id, cardToken, customer.id);
    console.log('Charge created:', charge);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
  }
};

checkout();
