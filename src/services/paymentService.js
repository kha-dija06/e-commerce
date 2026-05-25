import api from './api';

export const paymentService = {
  createIntent: (amount) => api.post('/payment/intent', { amount }),
  confirm: (paymentId) => api.post('/payment/confirm', { paymentId }),
};

export default paymentService;
