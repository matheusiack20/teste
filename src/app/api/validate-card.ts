/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import pagarme from 'pagarme';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cardHash, customer, billing } = req.body;

    console.log("Recebido cardHash:", cardHash);
    console.log("Usando a chave da API:", process.env.PAGARME_API_KEY);

    try {
      const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

      // Tenta criar uma transação de teste para validar o cartão
      const transaction = await client.transactions.create({
        amount: 100, // Valor simbólico para validação
        card_hash: cardHash,
        customer,
        billing,
        items: [
          {
            id: 'r123',
            title: 'Produto Teste',
            unit_price: 100,
            quantity: 1,
            tangible: true,
          },
        ],
      });

      console.log("Transação de validação:", transaction);

      if (transaction.status === 'authorized') {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: 'Cartão inválido.' });
      }
    } catch (error: any) {
      console.error('Erro ao validar o cartão:', error);

      if (error.response) {
        console.error('Erro da API do Pagar.me:', error.response.data);
        console.error('Status da resposta:', error.response.status);
        console.error('Cabeçalhos:', error.response.headers);
      }

      res.status(500).json({ success: false, error: 'Erro ao validar o cartão.', details: error.response?.data });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
