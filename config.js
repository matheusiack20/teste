import dotenv from 'dotenv';
dotenv.config();

console.log('PAGARME_API_KEY:', process.env.PAGARME_API_KEY);
console.log('NEXT_PUBLIC_PAGARME_PUBLIC_KEY:', process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY);

const config = {
  pagarmeApiKey: 'sk_test_bbb5414c26d042a79ff0bddea23d109a'
};

export default config;
