export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

export const getCurrentMonthName = () => {
  return new Date().toLocaleString('default', { month: 'long' });
};

export const getMonthName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long' });
};
