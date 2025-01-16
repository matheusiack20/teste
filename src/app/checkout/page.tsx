/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { validateCPF } from "../../services/cpfService";
import { validateCNPJ } from "../../services/cnpjService";
import cardValidator from "card-validator"; // Biblioteca de validação de cartões
import Image from "next/image";
import { createCustomer, createOrder, generateCardToken, createCharge } from "../../services/paymentService"; // Corrigido o caminho do módulo

// Importação de imagens das bandeiras
import cartao_visa from "../../../public/cartoes/logo_visa.png";
import cartao_mastercard from "../../../public/cartoes/logo_mastercard.png";
import cartao_amex from "../../../public/cartoes/logo_American_Express.png";
import cartao_elo from "../../../public/cartoes/logo_elo.png";
import cartao_hipercard from "../../../public/cartoes/logo_hipercard.png";
import cartao_jcb from "../../../public/cartoes/logo_jcb.png";
import cartao_diners from "../../../public/cartoes/logo_Diners.png";
import cartao_discover from "../../../public/cartoes/logo_discover.png";
import cartao_hiper from "../../../public/cartoes/logo_hiper.png";
import cartao_cabal from "../../../public/cartoes/logo_cabal.png";

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  interface FormData {
    identification: {
      name?: string;
      email?: string;
      cpf?: string;
      cnpj?: string;
      phone?: string;
    };
    address: {
      cep?: string;
      street?: string;
      district?: string;
      city?: string;
      state?: string;
      number?: string;
      complement?: string;
    };
    payment: {
      cardNumber?: string;
      cardName?: string;
      expiry?: string;
      cvv?: string;
    };
    item: {
      description?: string;
      quantity?: string;
      amount?: string;
      code?: string;
    };
  }

  const [formData, setFormData] = useState<FormData>({
    identification: {},
    address: {},
    payment: {},
    item: {},
  });

  type CardFlag = keyof typeof cardFlags;
  const [cardFlag, setCardFlag] = useState<CardFlag | null>(null); // Para armazenar a bandeira do cartão
  const [errorMessage, setErrorMessage] = useState(""); // Para armazenar a mensagem de erro
  const [successMessage, setSuccessMessage] = useState(""); // Para armazenar a mensagem de sucesso
  const [cepError, setCepError] = useState(""); // Para armazenar a mensagem de erro do CEP

  const cardFlags = {
    visa: cartao_visa,
    mastercard: cartao_mastercard,
    "american-express": cartao_amex,
    elo: cartao_elo,
    "diners-club": cartao_diners,
    discover: cartao_discover,
    jcb: cartao_jcb,
    hiper: cartao_hiper,
  };

  const handleInputChange = (step: keyof FormData, field: string, value: string) => {
    // Adiciona barra (/) automaticamente no campo de validade do cartão
    if (step === "payment" && field === "expiry") {
      value = value.replace(/\D/g, ""); // Remove caracteres não numéricos
      if (value.length > 4) {
        value = value.slice(0, 4); // Limita a 4 caracteres numéricos
      }
      if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2); // Adiciona a barra
      }
    }

    if (step === "address" && field === "cep") {
      const sanitizedCep = value.replace(/\D/g, ""); // Remove caracteres não numéricos
      setFormData((prev) => ({
        ...prev,
        [step]: {
          ...prev[step],
          [field]: sanitizedCep,
        },
      }));

      if (sanitizedCep.length === 8) {
        fetchAddressData(sanitizedCep); // Chama a função somente quando o CEP tem 8 dígitos
      } else {
        setCepError(""); // Limpa a mensagem de erro enquanto o CEP está incompleto
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [step]: {
          ...prev[step],
          [field]: value,
        },
      }));
    }

    // Detecta bandeira ao digitar número do cartão
    if (step === "payment" && field === "cardNumber") {
      const result = cardValidator.number(value);
      if (result.isValid) {
        const cardType = result.card ? result.card.type as CardFlag : null;
        setCardFlag(cardType); // Define a bandeira
      } else {
        setCardFlag(null); // Limpa a bandeira se inválido
      }
    }
  };

  const fetchAddressData = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            street: data.logradouro || "",
            district: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          },
        }));
        setCepError(""); // Limpa qualquer mensagem de erro anterior
      } else {
        setCepError("CEP não encontrado."); // CEP inválido
      }
    } catch (error) {
      console.error("Erro ao buscar dados do CEP:", error);
      setCepError("Erro ao buscar dados do CEP. Verifique sua conexão.");
    }
  };

  const handleImageError = () => {
    setCardFlag(null); // Limpa a bandeira se houver erro ao carregar a imagem
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const { name, email, cpf, cnpj, phone } = formData.identification;
      if (cpf && !validateCPF(cpf)) {
        setErrorMessage("CPF inválido.");
        return false;
      }
      if (cnpj && !validateCNPJ(cnpj)) {
        setErrorMessage("CNPJ inválido.");
        return false;
      }
      if (!name || !email || !(cpf || cnpj) || !phone) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const { cep, street, district, city, state, number, complement } = formData.address;
      if (!cep || !street || !district || !city || !state || !number) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
      if (cepError) {
        setErrorMessage(cepError);
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      const { cardNumber, cardName, expiry, cvv } = formData.payment;
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }

      // Validação da data de validade do cartão
      const [month, year] = expiry.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Janeiro é 0
      const currentYear = currentDate.getFullYear() % 100; // Últimos dois dígitos do ano

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        setErrorMessage("Data de validade do cartão inválida.");
        return false;
      }

      // Validação do CVV
      if (cvv.length > 3) {
        setErrorMessage("CVV inválido.");
        return false;
      }

      return true;
    }

    if (currentStep === 4) {
      const { description, quantity, amount, code } = formData.item;
      if (!description || !quantity || !amount || !code) {
        setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
        return false;
      }
      return true;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      setErrorMessage(""); // Limpa a mensagem de erro ao avançar para o próximo passo
    }
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const finalizePurchase = async () => {
    try {
      const cardToken = await generateCardToken({
        number: formData.payment.cardNumber,
        holder_name: formData.payment.cardName,
        holder_document: formData.identification.cpf || formData.identification.cnpj,
        exp_month: formData.payment.expiry ? parseInt(formData.payment.expiry.split("/")[0], 10) : 0,
        exp_year: parseInt((formData.payment.expiry ?? "00/00").split("/")[1], 10),
        cvv: formData.payment.cvv,
        brand: cardFlag,
        billing_address: {
          line_1: `${formData.address.number}, ${formData.address.street}, ${formData.address.district}`,
          line_2: formData.address.complement || "",
          zip_code: formData.address.cep,
          city: formData.address.city,
          state: formData.address.state,
          country: "BR",
        },
      });
      console.log('Card token generated:', cardToken);

      if (cardToken) {
        const customer = await createCustomer({
          name: formData.identification.name,
          email: formData.identification.email,
          type: 'individual',
          documents: [
            { type: formData.identification.cpf ? 'cpf' : 'cnpj', number: formData.identification.cpf || formData.identification.cnpj }
          ],
          phone_numbers: [formData.identification.phone],
          birthday: '1990-01-01',
          document: formData.identification.cpf || formData.identification.cnpj,
          phones: {
            mobile_phone: {
              country_code: '55',
              area_code: formData.identification.phone?.slice(0, 2),
              number: formData.identification.phone?.slice(2)
            }
          }
        });
        console.log('Customer created:', customer);

        if (customer && customer.id) {
          const order = await createOrder(customer.id, {
            items: [
              {
                amount: parseInt(formData.item.amount ?? "0"),
                description: formData.item.description,
                quantity: parseInt(formData.item.quantity ?? "0"),
                tangible: true,
                code: formData.item.code
              }
            ],
            customer_id: customer.id,
            shipping: {
              name: formData.identification.name,
              fee: 1000,
              delivery_date: '2025-01-20',
              expedited: true,
              address: {
                country: 'BR',
                state: formData.address.state,
                city: formData.address.city,
                neighborhood: formData.address.district,
                street: formData.address.street,
                street_number: formData.address.number,
                zip_code: formData.address.cep
              },
              description: 'Entrega rápida'
            },
            payments: [
              {
                payment_method: 'credit_card',
                credit_card: {
                  installments: 1,
                  statement_descriptor: 'Teste',
                  card: {
                    number: formData.payment.cardNumber,
                    holder_name: formData.payment.cardName,
                    exp_month: formData.payment.expiry?.split('/')[0],
                    exp_year: formData.payment.expiry?.split('/')[1],
                    cvv: formData.payment.cvv,
                    billing_address: {
                      country: 'BR',
                      state: formData.address.state,
                      city: formData.address.city,
                      neighborhood: formData.address.district,
                      street: formData.address.street,
                      street_number: formData.address.number,
                      zip_code: formData.address.cep
                    }
                  }
                }
              }
            ],
            billing: {
              name: formData.identification.name,
              address: {
                country: 'BR',
                state: formData.address.state,
                city: formData.address.city,
                neighborhood: formData.address.district,
                street: formData.address.street,
                street_number: formData.address.number,
                zip_code: formData.address.cep
              }
            },
            closed: false,
            status: 'open'
          });
          console.log('Order created:', order);

          if (order && order.id) {
            const charge = await createCharge(order.id, cardToken, customer.id);
            console.log('Charge created:', charge);
            if (charge) {
              setSuccessMessage("Compra finalizada com sucesso!");
            }
          } else {
            console.error('Erro ao criar o pedido:', order);
          }
        } else {
          console.error('Erro ao criar o cliente:', customer);
        }
      }
    } catch (error) {
      console.error("Erro ao processar a compra:", error);
      setErrorMessage("Erro ao processar a compra. Tente novamente.");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Código que depende do ambiente do cliente
    }
  }, []);

  return (
    <div className="checkout-container">
      {/* Sobreposição para desfocar o fundo */}
      {(errorMessage || successMessage) && <div className="popup-overlay"></div>}

      {/* Barra de progresso */}
      <div className="progress-bar">
        {["Identificação", "Endereço", "Pagamento", "Item", "Revisão"].map(
          (step, index) => {
            const stepIndex = index + 1;
            const isCompleted = currentStep > stepIndex;
            const isActive = currentStep === stepIndex;
            return (
              <div
                key={stepIndex}
                className={`progress-step ${isCompleted ? "completed" : ""} ${
                  isActive ? "current" : ""
                }`}
              >
                <div className="step-icon">
                  {isCompleted ? "✔" : stepIndex}
                </div>
                <span className="step-label">{step}</span>
              </div>
            );
          }
        )}
      </div>

      {/* Formulários */}
      <div className="form-section">
        {currentStep === 1 && (
          <div>
            <h2>Identificação</h2>
            <form>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nome Completo"
                value={formData.identification.name || ""}
                onChange={(e) =>
                  handleInputChange("identification", "name", e.target.value)
                }
                required
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-mail"
                value={formData.identification.email || ""}
                onChange={(e) =>
                  handleInputChange("identification", "email", e.target.value)
                }
                required
              />
              <input
                type="text"
                id="cpfCnpj"
                name="cpfCnpj"
                placeholder="CPF ou CNPJ"
                value={
                  formData.identification.cpf ||
                  formData.identification.cnpj ||
                  ""
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 11) {
                    handleInputChange("identification", "cpf", value);
                    handleInputChange("identification", "cnpj", "");
                  } else {
                    handleInputChange("identification", "cnpj", value);
                    handleInputChange("identification", "cpf", "");
                  }
                }}
                required
              />
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Celular com DDD"
                value={formData.identification.phone || ""}
                onChange={(e) =>
                  handleInputChange("identification", "phone", e.target.value)
                }
                required
              />
              <div className="form-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={previousStep}
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="button"
                  className="button-primary"
                  onClick={nextStep}
                >
                  Próximo
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2>Endereço</h2>
            <form>
              <input
                type="text"
                id="cep"
                name="cep"
                placeholder="CEP"
                value={formData.address.cep || ""}
                onChange={(e) =>
                  handleInputChange("address", "cep", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Rua"
                value={formData.address.street || ""}
                readOnly
              />
              <input
                type="text"
                id="number"
                name="number"
                placeholder="Número"
                value={formData.address.number || ""}
                onChange={(e) =>
                  handleInputChange("address", "number", e.target.value)
                }
                required
              />
              <input
                type="text"
                id="complement"
                name="complement"
                placeholder="Complemento (opcional)"
                value={formData.address.complement || ""}
                onChange={(e) =>
                  handleInputChange("address", "complement", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Bairro"
                value={formData.address.district || ""}
                readOnly
              />
              <input
                type="text"
                placeholder="Cidade"
                value={formData.address.city || ""}
                readOnly
              />
              <input
                type="text"
                placeholder="Estado"
                value={formData.address.state || ""}
                readOnly
              />
              <div className="form-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={previousStep}
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="button"
                  className="button-primary"
                  onClick={nextStep}
                >
                  Próximo
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2>Pagamento</h2>
            <form>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="Número do Cartão"
                  value={formData.payment.cardNumber || ""}
                  onChange={(e) =>
                    handleInputChange("payment", "cardNumber", e.target.value)
                  }
                  required
                />
                {cardFlag && (
                  <Image
                    src={cardFlags[cardFlag] || ""}
                    alt={`Bandeira do cartão ${cardFlag}`}
                    width={50}
                    height={30}
                    className="card-flag-icon"
                    style={{ width: '50px', height: '25px' }} // Adiciona tamanho fixo
                    onError={handleImageError} // Adiciona manipulador de erro
                  />
                )}
              </div>
              <input
                type="text"
                id="cardName"
                name="cardName"
                placeholder="Nome no Cartão"
                value={formData.payment.cardName || ""}
                onChange={(e) =>
                  handleInputChange("payment", "cardName", e.target.value)
                }
                required
              />
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="Validade (MM/AA)"
                value={formData.payment.expiry || ""}
                onChange={(e) =>
                  handleInputChange("payment", "expiry", e.target.value)
                }
                required
              />
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="CVV"
                value={formData.payment.cvv || ""}
                onChange={(e) =>
                  handleInputChange("payment", "cvv", e.target.value)
                }
                required
              />
              <div className="form-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={previousStep}
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="button"
                  className="button-primary"
                  onClick={nextStep}
                >
                  Próximo
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2>Item</h2>
            <form>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Descrição do Item"
                value={formData.item.description || ""}
                onChange={(e) =>
                  handleInputChange("item", "description", e.target.value)
                }
                required
              />
              <input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="Quantidade"
                value={formData.item.quantity || ""}
                onChange={(e) =>
                  handleInputChange("item", "quantity", e.target.value)
                }
                required
              />
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Valor (em centavos)"
                value={formData.item.amount || ""}
                onChange={(e) =>
                  handleInputChange("item", "amount", e.target.value)
                }
                required
              />
              <input
                type="text"
                id="code"
                name="code"
                placeholder="Código do Item"
                value={formData.item.code || ""}
                onChange={(e) =>
                  handleInputChange("item", "code", e.target.value)
                }
                required
              />
              <div className="form-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={previousStep}
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="button"
                  className="button-primary"
                  onClick={nextStep}
                >
                  Próximo
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2>Revisão</h2>
            <div className="review-section">
              <h3>Identificação</h3>
              <p>Nome: {formData.identification.name}</p>
              <p>Email: {formData.identification.email}</p>
              <p>CPF/CNPJ: {formData.identification.cpf || formData.identification.cnpj}</p>
              <p>Celular: {formData.identification.phone}</p>

              <h3>Endereço</h3>
              <p>CEP: {formData.address.cep}</p>
              <p>Rua: {formData.address.street}</p>
              <p>Número: {formData.address.number}</p>
              <p>Bairro: {formData.address.district}</p>
              <p>Cidade: {formData.address.city}</p>
              <p>Estado: {formData.address.state}</p>

              <h3>Item</h3>
              <p>Descrição: {formData.item.description}</p>
              <p>Quantidade: {formData.item.quantity}</p>
              <p>Valor: {formData.item.amount}</p>
              <p>Código: {formData.item.code}</p>
              
              <div className="form-buttons">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={previousStep}
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="button"
                  className="button-primary"
                  onClick={finalizePurchase}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pop-up de erro */}
      {errorMessage && (
        <div className="error-popup">
          <div className="error-popup-content">
            <span className="error-popup-message">{errorMessage}</span>
            <button
              className="error-popup-close"
              onClick={() => setErrorMessage("")}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Pop-up de sucesso */}
      {successMessage && (
        <div className="success-popup">
          <div className="success-popup-content">
            <span className="success-popup-message">{successMessage}</span>
            <button
              className="success-popup-close"
              onClick={() => setSuccessMessage("")}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
