/* eslint-disable @typescript-eslint/no-require-imports */
const config = require('../config');
// ...existing code...

const pagarme = require('pagarme');

pagarme.client.connect({ api_key: config.pagarmeApiKey })
    .then(() => {
        // ...existing code...
    })
    .catch(error => {
        console.error('Erro ao conectar ao PagarMe:', error);
        // ...existing code...
    });

// ...existing code...
