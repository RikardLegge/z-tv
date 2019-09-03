const { html } = require('htm/react');
const { useState, useEffect, Fragment } = require('react');
const Typography = require('@material-ui/core/Typography').default;
const Table = require('@material-ui/core/Table').default;
const TableBody = require('@material-ui/core/TableBody').default;
const TableCell = require('@material-ui/core/TableCell').default;
const TableRow = require('@material-ui/core/TableRow').default;
const CircularProgress = require('@material-ui/core/CircularProgress').default;
const Paper = require('@material-ui/core/Paper').default;
const {Cart} = require('../Cart');
const products = require('../products');
const bank = require('../bank');
const {useCardReader} = require('../CardReader');
const {useKeyboard} = require('../keyboard');
const style = require("./style");

const EMPTY = {};
function ShoppingView({goBack, setHidden, hidden}) {
  const [cart, setCart] = useState(new Cart());
  const [state, setState] = useState(EMPTY);

  useEffect(()=>{
    function clearMessage() {
      setHidden(true);
    }

    if(state === EMPTY) return;
    if(state.paying) return;
    const key = setTimeout(clearMessage, 10000);
    return ()=> clearTimeout(key);
  });

  useEffect(()=>{
    function clearMessage() {
      setHidden(true);
    }

    if(state !== EMPTY) return;
    if(state.paying) return;
    const key = setTimeout(clearMessage, 60000);
    return () => clearTimeout(key);
  });

  useCardReader( async (card)=>{
    if(cart.isEmpty()) return;
    if(state !== EMPTY) return;

    const price = cart.price();
    try {
      setState({paying: true});
      const balance = await bank.pay(card, price);
      setState({paid: {price, balance}});
    } catch(err) {
      console.error(err);
      setState({failed: true});
    }
  });

  useKeyboard((key)=>{
    function addToCart(tp) {
      let newCart = cart;
      if(state.canceled || state.paid) {
        newCart = new Cart();
      }
      newCart.add(tp);
      setState(EMPTY);
      setHidden(false);
      setCart(new Cart(newCart));
    }

    if(state.paying) return;
    switch(key) {
      case "1": return addToCart(products.Coffee);
      case "2": return addToCart(products.Kettle);
      case "3": return addToCart(products.Cookie);
      case "+": {
        setCart(new Cart());
        setState(EMPTY);
        setHidden(false);
        return goBack();
      }
      case "Backspace": {
        if(cart.isEmpty()) return;
        if(state.canceled) return setHidden(true);
        return setState({canceled: true});
      }
    }
  });

  return html`
    <${Paper} style=${style.paper(!hidden)}>
      <${ShoppingCart} cart=${cart}/>
      ${state.canceled && html`<${Canceled}/>`}
      ${state.failed && html`<${Failed}/>`}
      ${state.paying && html`<${Paying}/>`}
      ${state.paid && html`<${Paid} paid="${state.paid}"/>`}
    <//>
    `;
};

const canceledStyled = {
  ...style.fill,
  ...style.red,
};
function Canceled() {
  return html`
    <div style=${canceledStyled}>
      <div style=${style.center}>
        <${Typography}>Tråkigt att du ångrat dig, men kom tillbaka för mer kaffe någon annan gång!<//>
      </div>
    </div>
  `;
}
function Failed() {
  return html`
    <div style=${canceledStyled}>
      <div style=${style.center}>
        <${Typography}>Betalningen gick inte igenom...<//>
        <${Typography}>Men ta ditt fika så kan du betala för det någon annan gång!<//>
      </div>
    </div>
  `;
}

const payingStyle = {
  ...style.fill,
  ...style.white
};
function Paying() {
  return html`
    <div style=${payingStyle}>
      <div style=${style.center}>
        <${CircularProgress} />
      </div>
    </div>
  `;
}

const paidStyle = {
  ...style.fill,
  ...style.white,
};
const paidBoxStyle = {
  ...style.green,
  ...style.box,
};
function Paid({paid}) {
  return html`
    <${Fragment}>
      <div style=${paidStyle}>
        <${Typography} variant="h2">${paid.balance} kr<//>
      </div>
      <div style=${paidBoxStyle}>
        <${Typography}>Hoppas kaffet smakar!<//>
        <${Typography}>Du har kvar följande belopp på kontot<//>
      </div>
    <//>
  `;
}

const shoppingListStyle = {
  padding: "0 20px"
};
const shoppingCartStyle = {
  ...style.gray,
  padding: "20px"
};
function ShoppingCart({cart}) {
  return html`
    <${Fragment}>
      <div style=${shoppingListStyle}>
        <${ShoppingList} cart=${cart}/>
      </div>
      <div style=${shoppingCartStyle}>
        <${Typography}>Lägg kortet på betalterminalen för att slutföra ditt köp!<//>
      </div>
    <//>
  `;
}

function ShoppingList({cart}) {
  return html`
    <${Table}>
      <${TableBody}>
        ${cart.map((item) => html`
          <${TableRow} key=${item.tp.name}>
            <${TableCell}><${item.tp.icon}/><//>
            <${TableCell}>${item.tp.name}<//>
            <${TableCell}>${item.count}x<//>
            <${TableCell}>${item.price()} kr<//>
          <//>
        `)}
        <${TableRow}>
          <${TableCell}><//>
          <${TableCell}>Total<//>
          <${TableCell}><//>
          <${TableCell}>${cart.price()} kr<//>
        <//>
      <//>
    <//>
  `
}

module.exports = ShoppingView;