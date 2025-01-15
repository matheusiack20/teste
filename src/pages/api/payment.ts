import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.pagar.me/core/v5/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.NEXT_PUBLIC_PAGARME_AUTHORIZATION_BASIC}`
        },
        body: JSON.stringify(req.body),
      });

      const result = await response.json();
      res.status(response.status).json(result);
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
