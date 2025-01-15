/* eslint-disable @typescript-eslint/no-unused-vars */
// ...existing code...
async function generateCardToken(cardDetails: { number: string; expiration_date: string; holder_name: string; cvv: string }) {
    console.log('Iniciando a geração do token do cartão');
    try {
        const response = await fetch('https://api.pagar.me/1/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardDetails),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Token do cartão gerado com sucesso:', data.token);
        return data.token;
    } catch (error) {
        console.error('Erro ao gerar token do cartão:', error);
        throw error;
    }
}
// ...existing code...
interface PurchaseDetails {
    card: {
        number: string;
        expiration_date: string;
        holder_name: string;
        cvv: string;
    };
    // Add other properties of purchaseDetails if needed
}

async function finalizePurchase(purchaseDetails: PurchaseDetails) {
    console.log('Iniciando a finalização da compra');
    try {
        const token = await generateCardToken(purchaseDetails.card);
        console.log('Token recebido:', token);
        // ...existing code...
    } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
        // Trate o erro de acordo com a necessidade
    }
}
// ...existing code...
