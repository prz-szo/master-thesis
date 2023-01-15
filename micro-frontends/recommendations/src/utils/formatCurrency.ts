export const formatCurrency = (value: number, currency = "USD") =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default formatCurrency;
