import { apiClient } from './api';

/**
 * Inicia o processo de pagamento via Mercado Pago
 * @param {number} orderId - ID do pedido
 * @returns {Promise<string>} URL de pagamento
 */
export const initiateMercadoPagoPayment = async (orderId) => {
  try {
    const response = await apiClient.get('/payment/getPayment', {
      params: { id: orderId }
    });
    return response.data.payment_url || response.data;
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw new Error('Não foi possível iniciar o pagamento. Tente novamente.');
  }
};

/**
 * Abre o pop-up do Mercado Pago
 * @param {string} paymentUrl - URL de pagamento
 * @returns {Window} Referência da janela pop-up
 */
export const openMercadoPagoPopup = (paymentUrl) => {
  const popup = window.open(
    paymentUrl,
    'MercadoPago',
    'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
  );

  if (!popup) {
    throw new Error('Pop-up bloqueado pelo navegador. Por favor, permita pop-ups para este site.');
  }

  return popup;
};

/**
 * Processa o pagamento completo (criar preferência + abrir pop-up)
 * @param {number} orderId 
 * @param {Object} callbacks - { onSuccess, onError }
 */
export const processPayment = async (orderId, { onSuccess, onError } = {}) => {
  try {
    // Busca a URL de pagamento do backend
    const paymentUrl = await initiateMercadoPagoPayment(orderId);

    // Abre o pop-up
    const popup = openMercadoPagoPopup(paymentUrl);

    if (onSuccess) onSuccess({ popup, paymentUrl });

    return popup;
  } catch (error) {
    if (onError) onError(error);
    throw error;
  }
};