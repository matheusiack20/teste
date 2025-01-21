declare module 'pagarme' {
  export namespace client {
    function connect(options: { api_key: string }): Promise<Client>;

    interface Client {
      transactions: {
        create(data: TransactionData): Promise<Transaction>;
      };
    }
  }

  export interface TransactionData {
    amount: number;
    card_number: string;
    card_holder_name: string;
    card_expiration_date: string;
    card_cvv: string;
    customer: {
      external_id: string;
      name: string;
      email: string;
      type: string;
      country: string;
      documents: Array<{
        type: string;
        number: string;
      }>;
    };
  }

  export interface Transaction {
    id: string;
    status: string;
    amount: number;
    authorized_amount: number;
    paid_amount: number;
    refunded_amount: number;
    installments: number;
    cost: number;
    card_holder_name: string;
    card_last_digits: string;
    card_first_digits: string;
    card_brand: string;
    card_pin_mode: string;
    postback_url: string;
    payment_method: string;
    capture_method: string;
    antifraud_score: string;
    boleto_url: string;
    boleto_barcode: string;
    boleto_expiration_date: string;
    referer: string;
    ip: string;
    subscription_id: string;
    phone: {
      object: string;
      id: string;
      ddi: string;
      ddd: string;
      number: string;
    };
    address: {
      object: string;
      id: string;
      street: string;
      complementary: string;
      street_number: string;
      neighborhood: string;
      city: string;
      state: string;
      zipcode: string;
      country: string;
    };
    customer: {
      object: string;
      id: string;
      external_id: string;
      type: string;
      country: string;
      document_number: string;
      document_type: string;
      name: string;
      email: string;
      phone_numbers: string[];
      born_at: string;
      birthday: string;
      gender: string;
      date_created: string;
      documents: Array<{
        object: string;
        id: string;
        type: string;
        number: string;
      }>;
    };
    billing: {
      object: string;
      id: string;
      name: string;
      address: {
        object: string;
        id: string;
        street: string;
        complementary: string;
        street_number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
      };
    };
    shipping: {
      object: string;
      id: string;
      name: string;
      fee: number;
      delivery_date: string;
      expedited: boolean;
      address: {
        object: string;
        id: string;
        street: string;
        complementary: string;
        street_number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
      };
    };
    items: Array<{
      object: string;
      id: string;
      title: string;
      unit_price: number;
      quantity: number;
      tangible: boolean;
      category: string;
      venue: string;
      date: string;
    }>;
    card: {
      object: string;
      id: string;
      date_created: string;
      date_updated: string;
      brand: string;
      holder_name: string;
      first_digits: string;
      last_digits: string;
      country: string;
      fingerprint: string;
      valid: boolean;
      expiration_date: string;
    };
    split_rules: Array<{
      object: string;
      id: string;
      liable: boolean;
      amount: number;
      percentage: number;
      recipient_id: string;
      charge_processing_fee: boolean;
      charge_remainder_fee: boolean;
      charge_fine: boolean;
    }>;
    metadata: {
      [key: string]: any;
    };
  }
}
