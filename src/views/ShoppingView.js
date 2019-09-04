const { html } = require('htm/react');
const { useState, useEffect, Fragment } = require('react');
const Typography = require('@material-ui/core/Typography').default;
const Table = require('@material-ui/core/Table').default;
const TableBody = require('@material-ui/core/TableBody').default;
const TableCell = require('@material-ui/core/TableCell').default;
const TableRow = require('@material-ui/core/TableRow').default;
const CircularProgress = require('@material-ui/core/CircularProgress').default;
const {Cart} = require('../Cart');
const products = require('../products');
const {hideDelay} = require('../config');
const {pay} = require('../bank');
const {useCardReader} = require('../CardReader');
const {useKeyboard} = require('../keyboard');
const style = require("./style");

const EMPTY = {add: true};
function ShoppingView({goToSwish, setHidden}) {
  const [cart, setCart] = useState(new Cart());
  const [state, setState] = useState(EMPTY);

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

  useEffect(()=>{
    let delay = hideDelay;
    if(state.add) delay = 2*hideDelay;
    if(state.paying) delay = 60*hideDelay;
    const key = setTimeout(()=>setHidden(true), delay);
    return ()=> clearTimeout(key);
  });

  useKeyboard((key)=>{
    if(state.paying) return;
    switch(key) {
      case "1": return addToCart(products.Coffee);
      case "2": return addToCart(products.Kettle);
      case "3": return addToCart(products.Cookie);
      case "+": {
        setCart(new Cart());
        setState(EMPTY);
        setHidden(false);
        return goToSwish();
      }
      case "Backspace": {
        if(cart.isEmpty()) return;
        if(state.canceled) return setHidden(true);
        return setState({canceled: true});
      }
    }
  });

  return html`
    <${Fragment}>
      <${ShoppingCart} cart=${cart}/>
      <div style=${style.overlay}>
        ${state.add && html`<${Add} cart=${cart} setState=${setState}/>`}
        ${state.canceled && html`<${Canceled}/>`}
        ${state.failed && html`<${Failed}/>`}
        ${state.paying && html`<${Paying}/>`}
        ${state.paid && html`<${Paid} paid="${state.paid}"/>`}
      </div>
    <//>
  `;
}

function Add({cart, setState}) {
  useCardReader( async (card)=>{
    if(cart.isEmpty()) return;

    const price = cart.price();
    try {
      setState({paying: true});
      const balance = await pay(card, price);
      setState({paid: {price, balance}});
    } catch(err) {
      console.error(err);
      setState({failed: true});
    }
  });
  return null;
}

const canceledStyled = {
  ...style.center,
  ...style.red,
};
function Canceled() {
  return html`
    <div style=${canceledStyled}>
      <${Typography}>Tråkigt att du ångrat dig, men kom tillbaka för mer kaffe någon annan gång!<//>
    </div>
  `;
}
function Failed() {
  return html`
    <div style=${canceledStyled}>
      <${Typography}>Betalningen gick inte igenom...<//>
      <${Typography}>Men ta ditt fika så kan du betala för det någon annan gång!<//>
    </div>
  `;
}

const payingStyle = {
  ...style.overlay,
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
  ...style.center,
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
    <div style=${style.layer}>
      <div style=${shoppingListStyle}>
        <${ShoppingList} cart=${cart}/>
      </div>
      <div style=${shoppingCartStyle}>
        <${Typography}>Lägg kortet på betalterminalen för att slutföra ditt köp!<//>
      </div>
    </div>
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
            <${TableCell}>${item.isMax() 
                ? `MAX (${item.count}x)`
                : `${item.count}x`}
            <//>
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