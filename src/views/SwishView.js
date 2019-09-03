const { html } = require('htm/react');
const { useState, useEffect, Fragment } = require('react');
const Typography = require('@material-ui/core/Typography').default;
const Paper = require('@material-ui/core/Paper').default;
const {useCardReader} = require('../CardReader');
const bank = require('../bank');
const {useKeyboard} = require('../keyboard');
const style = require('./style');
const QRCode = require('qrcode');
const CircularProgress = require('@material-ui/core/CircularProgress').default;

const EMPTY = {};
function SwishView({goBack, hidden}) {
  const [warning, setWarning] = useState(null);
  const [state, setState] = useState(EMPTY);
  const [amount, setAmount] = useState(0);

  useEffect(()=>{
    let delay = 10000;
    if(state.paying) return;
    if(state.qr) delay = 60000;
    const key = setTimeout(goBack, delay);
    return ()=> clearTimeout(key);
  }, [amount, state]);

  useCardReader( (card)=>{
    if(state === EMPTY && amount >= 50 && amount <= 500) {
      const phone = "1234739561";
      const message = `ZKK laddning ${card}`.replace(/ /, "+");
      QRCode.toDataURL(`C${phone};${amount};${message};0`,{} ,(err, code) => {
        if (err) return setState({failed: err});
        setState({qr:{code, card}});
      });
    }
  });

  useEffect(()=>{
    if(amount > 500) setWarning("Högsta laddningsbeloppet är 500kr");
    else if(amount < 50) setWarning("Minsta laddningsbeloppet är 50kr");
    else setWarning(null);
  }, [amount]);

  useKeyboard(async (key)=>{
    console.log(key);

    if(state.paying) return;
    if(state.failed) return goBack();
    if(state.paid) return goBack();
    if(state.qr) {
      if(key === "Enter") {
        try {
          setState({paying: true});
          const balance = await bank.pay(state.qr.card, -amount);
          setState({paid: {balance, amount}})
        } catch (err) {
          console.error(err);
          setState({failed: err})
        }
      }
      if(key === "Backspace") return setState(EMPTY);
      return;
    }
    if(state === EMPTY) {
      const number = Number.parseInt(key);
      if (!Number.isNaN(number)) {
        const newAmount = amount * 10 + number;
        if (amount === 0) return setAmount(number);
        return setAmount(newAmount);
      }
      if (key === "Backspace") {
        if (amount === 0) return goBack();
        const newAmount = Math.floor(amount / 10);
        return setAmount(newAmount);
      }
    }
  });

  return html`
    <${Paper} style=${style.paper(!hidden)}>
      <${Body}/>
      ${state === EMPTY && html`<${Charge} amount=${amount}/>`}
      ${state.qr && html`<${QR} qr=${state.qr.code} amount=${amount}/>`}
      ${state.paid && html`<${Paid} paid=${state.paid}/>`}
      ${state.paying && html`<${Paying}/>`}
      ${state.failed && html`<${Failed}/>`}
      <${Warning} warning=${warning}/>
    <//>
    `;
}

const canceledStyled = {
  ...style.fill,
  ...style.red,
};
function Failed() {
  return html`
    <div style=${canceledStyled}>
      <div style=${style.center}>
        <${Typography}>Det gick inte att ladda kortet<//>
        <${Typography}>Om du redan hunnit swisha så är det bara att kontakta sektionskassören så löser han det<//>
      </div>
    </div>
  `;
}

function Paying() {
  return html`
    <div style=${style.fill}>
      <div style=${style.center}>
        <${CircularProgress}/>
      </div>
    </div>
  `;
}

const paidBoxStyle = {
  ...style.green,
  ...style.box,
};
function Paid({paid}) {
  return html`
    <${Fragment}>
      <div style=${style.fill}>
        <${Typography} variant="h2">${paid.balance} kr<//>
      </div>
      <div style=${paidBoxStyle}>
        <${Typography}>Grattis! Ditt kort är nu laddat med följande belopp<//>
      </div>
    <//>
  `;
}

const qrStyle = {
  ...style.fill,
  justifyContent: "top",
  padding: "20px"
};
const qrImageStyle = {
  height: "150px",
};
const qrBoxStyle = {
  ...style.gray,
  ...style.box,
};
function QR({qr, amount}) {
  return html`
    <${Fragment}>
      <div style=${qrStyle}>
        ${qr && html`<img style=${qrImageStyle} src=${qr}/>`}
        <${Typography} variant="h2">${amount} kr<//>
      </div>
      <div style=${qrBoxStyle}>
        <${Typography} style=${style.center}>Betala genom att scanna QR koden med swish. Tryck sedan på ENTER<//>
      </div>
    <//>
  `;
}

const chargeStyle = {
  ...style.fill,
  display: "block",
  padding: "20px"
};
const chargePriceStyle = {
  ...style.center,
  marginTop: "78px",
};
function Charge({amount}) {
  return html`
    <div style=${chargeStyle}>
      <${Typography} style=${style.center}>Vänligen slå in så mycket som du velat ladda kortet med och visa sedan upp ditt kort för läsaren<//>
      <${Typography} variant="h2" style=${chargePriceStyle}>${amount} kr<//>
    </div>
  `;
}

const warningStyle = {
  ...style.orange,
  ...style.box,
};
function Warning({warning}) {
  if(!warning) return null;
  return html`
    <div style=${warningStyle}>
      <${Typography}>${warning}<//>
    </div>
  `;
}

const bodyStyle = {
  // ...style.gray,
  width: "320px",
  height: "320px",
};
function Body() {
  return html`<div style=${bodyStyle}/>`;
}

module.exports = SwishView;