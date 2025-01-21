import dotenv from 'dotenv';
dotenv.config();

console.log('PAGARME_API_KEY:', process.env.PAGARME_API_KEY);
console.log('NEXT_PUBLIC_PAGARME_PUBLIC_KEY:', process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY);

const config = {
  pagarmeApiKey: 'sk_test_00828b38f6f0413f8eddc1ae66523cf2'
};

export default config;
