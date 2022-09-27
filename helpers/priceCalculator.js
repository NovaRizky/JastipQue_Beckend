function calculateGrossAmount (value, quantity) {
  let serviceCharge = 0.05;
  return (value * quantity) + ((value * quantity) * serviceCharge);
};

module.exports = {
  calculateGrossAmount
};