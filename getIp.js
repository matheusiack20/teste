import axios from 'axios';

axios.get('https://api.ipify.org?format=json')
  .then(response => {
    console.log(`Seu IP de origem é: ${response.data.ip}`);
  })
  .catch(error => {
    console.error('Erro ao obter o IP de origem:', error);
  });
