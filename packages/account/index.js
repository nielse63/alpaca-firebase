const alpaca = require('@alpaca-firebase/alpaca');

const getBuyingPower = async () => {
  const account = await alpaca.getAccount();
  return parseFloat(account.non_marginable_buying_power);
};

module.exports = {
  getBuyingPower,
};
