const {CartItemType} = require('./Cart');
const LocalCafe = require('@material-ui/icons/LocalCafe').default;
const LocalGasStation = require('@material-ui/icons/LocalGasStation').default;
const LocalDining = require('@material-ui/icons/LocalDining').default;
const Cake = require('@material-ui/icons/Cake').default;

const Coffee = new CartItemType("Kaffe", 1, LocalCafe, 10);
const Kettle = new CartItemType("Kaffekanna", 10, LocalGasStation, 1);
const Cookie = new CartItemType("Kaka", 1, LocalDining, 10);
const SandwichCake = new CartItemType("Smörgåstårta", 25, Cake, 10);

module.exports = {Coffee, Kettle, Cookie, SandwichCake};
