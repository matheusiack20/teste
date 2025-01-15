/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';
const { validateApiKey, validatePaymentRequest } = require('../../../../validateApiKey');

interface CustomerData {
  id?: string;
  name: string;
  email: string;
  document: string;
  type: string;
  phones?: {
    mobile_phone?: {
      country_code: string;
      area_code: string;
      number: string;
    };
  };
}




const createCustomer = async (customerData: CustomerData): Promise<CustomerData> => {
  const response = await axios.post('https://api.pagar.me/core/v5/customers', customerData, {
    auth: {
      username: process.env.PAGARME_API_KEY || '',
      password: ''
    }
  });
  return response.data;
};

interface OrderData {
  id?: string;
  items: {
    id: string;
    title: string;
    unit_price: number;
    quantity: number;
    tangible: boolean;
  }[];
  customer_id?: string;
  shipping?: {
    address: {
      street: string;
      street_number: string;
      neighborhood: string;
      zipcode: string;
      city: string;
      state: string;
      country: string;
    };
  };
  payments?: {
    payment_method: string;
    credit_card?: {
      card_token: string;
    };
  }[];
}

const createOrder = async (orderData: OrderData) => {
  const response = await axios.post('https://api.pagar.me/core/v5/orders', orderData, {
    auth: {
      username: process.env.PAGARME_API_KEY || '',
      password: ''
    }
  });
  return response.data;
};

interface CardData {
  card_number: string;
  holder_name: string;
  exp_month: string;
  exp_year: string;
  cvv: string;
}

const generateCardToken = async (cardData: CardData) => {
  const response = await axios.post(`https://api.pagar.me/core/v5/tokens?appId=${process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY}`, cardData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

interface ChargeData {
  amount: number;
  order_id: string;
  customer_id: string;
  payment: {
    payment_method: string;
    credit_card: {
      card_token: string;
    };
  };
}

const createCharge = async (chargeData: ChargeData) => {
  const response = await axios.post('https://api.pagar.me/core/v5/charges', chargeData, {
    auth: {
      username: process.env.PAGARME_API_KEY || '',
      password: ''
    }
  });
  return response.data;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, order, card } = body;

    // Valide a chave da API
    validateApiKey(process.env.PAGARME_API_KEY);

    const customerData = await createCustomer(customer);
    const orderData = await createOrder({ ...order, customer_id: customerData.id });
    const cardToken = await generateCardToken(card);

    // Dados da requisição de cobrança
    if (!customerData.id) {
      throw new Error('Customer ID is undefined');
    }

    const chargeRequest = {
      order_id: orderData.id,
      customer_id: customerData.id,
      payment: {
        payment_method: 'credit_card',
        credit_card: {
          card_token: cardToken.id
        }
      },
      amount: 1000
    };

    // Valide os campos obrigatórios da requisição
    validatePaymentRequest(chargeRequest);

    const chargeData = await createCharge(chargeRequest);

    return NextResponse.json({ success: true, customer: customerData, order: orderData, charge: chargeData });
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar o pagamento.' }, { status: 500 });
  }
}
