const {CartItemType} = require('./Cart');
const LocalCafe = require('@material-ui/icons/LocalCafe').default;
const LocalGasStation = require('@material-ui/icons/LocalGasStation').default;
const LocalDining = require('@material-ui/icons/LocalDining').default;

const Coffee = new CartItemType("Kaffe", 1, LocalCafe);
const Kettle = new CartItemType("Kaffekanna", 10, LocalGasStation);
const Cookie = new CartItemType("Kaka", 1, LocalDining);

module.exports = {Coffee, Kettle, Cookie};
