/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, customer, billing, items } = req.body;

    console.log("Recebido dados para pagamento:", { amount, customer, billing, items });

    try {
      const apiKey = process.env.PAGARME_API_KEY;

      if (!apiKey) {
        throw new Error('API key is missing');
      }

      console.log("API Key obtida com sucesso:", apiKey);
      console.log("Iniciando criação do pedido...");

      const orderResponse = await axios.post('https://api.pagar.me/core/v5/orders', {
        items,
        customer,
        shipping: {
          name: customer.name,
          fee: 1000,
          delivery_date: '2021-12-25',
          expedited: true,
          address: billing.address
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
          billing_address: billing.address
        }
      }, {
        auth: {
          username: apiKey,
          password: ''
        }
      });

      console.log('Cobrança criada com sucesso:', chargeResponse.data);

      res.status(200).json({ success: true, order: orderResponse.data, charge: chargeResponse.data });

    } catch (error: any) {
      console.error('Erro ao criar pedido ou cobrança:', error);

      if (error.response) {
        console.error('Erro da API do Pagar.me:', error.response.data || 'Sem detalhes.');
        console.error('Status da resposta:', error.response.status || 'Sem status.');
        console.error('Cabeçalhos:', error.response.headers || 'Sem cabeçalhos.');
      } else {
        console.error('Erro desconhecido:', error);
      }

      res.status(500).json({
        success: false,
        error: 'Erro ao processar o pagamento.',
        details: error.message,
        apiResponse: error.response?.data || null,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
