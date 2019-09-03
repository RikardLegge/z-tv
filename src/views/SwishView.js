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
function SwishView({goBack, setHidden, hidden}) {
  const [warning, setWarning] = useState(null);
  const [state, setState] = useState(EMPTY);
  const [amount, setAmount] = useState(0);

  useEffect(()=>{
    const clear = () => {
      goBack();
      setHidden(true);
    };
    let delay = 60000;
    if(state.paying) return;
    if(state.paid) delay = 10000;
    const key = setTimeout(clear, delay);
    return ()=> clearTimeout(key);
  }, [amount, warning]);

  useCardReader( (card)=>{
    if(state === EMPTY && amount >= 50 && amount <= 500) {
      const phone = "1234739561";
      const message = `ZKK laddning ${card}`.replace(/ /, "+");
      QRCode.toDataURL(`C${phone};${amount};${message};0`, (err, code) => {
        if (err) return setState({failed: err});
        setState({qr:{code, card}});
      });
    }
  });

  useEffect(()=>{
    if(amount > 500) setWarning("Vänligen sätt inte in mer än 500kr i taget. Du må dricka mycket kaffe men tänk på ZKK");
    else if(amount < 50) setWarning("Vänligen ladda kortet med iallafall 50kr");
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

    const number = Number.parseInt(key);
    if(!Number.isNaN(number)) {
      const newAmount = amount * 10 + number;
      if(amount === 0) return setAmount(number);
      return setAmount(newAmount);
    }

    switch(key) {
      case "Enter": {
        let money = amount;
        if (money < 50) return;
        if (money > 500) return;


        return;
      }
      case "Backspace": {
        if(amount === 0) return goBack();
        const newAmount = Math.floor(amount / 10);
        return setAmount(newAmount);
      }
    }
  });

  return html`
    <${Paper} style=${style.paper(!hidden)}>
      <${Body}/>
      ${state === EMPTY && html`<${Charge} amount=${amount}/>`}
      ${state.qr && html`<${QR} qr=${state.qr.code}/>`}
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

const payingStyle = {
  ...style.fill,
  ...style.gray,
};
const loadingStyle = {
  color: "white",
};
function Paying() {
  return html`
    <div style=${payingStyle}>
      <div style=${style.center}>
        <${CircularProgress} style=${loadingStyle}/>
      </div>
    </div>
  `;
}

const paidStyle = {
  ...style.fill,
  ...style.green,
};
function Paid({paid}) {
  return html`
    <div style=${paidStyle}>
      <${Typography}>Grattis, Ditt kort är nu laddat!<//>
      <${Typography}>Betalt: ${paid.amount} kr<//>
      <${Typography}>Kontobalans: ${paid.balance} kr<//>
    </div>
  `;
}

const qrStyle = {
  marginTop: "10px"
};
function QR({qr, amount}) {
  return html`
    <div style=${chargeStyle}>
      <${Typography}>Vänligen skanna QR koden med swish. Tryck på ENTER när betalningen är gjord<//>
      <${Typography}>Pris: ${amount}<//>
      ${qr && html`<img src=${qr} style=${qrStyle}/>`}
    </div>
  `;
}

const chargeStyle = {
  ...style.fill,
  ...style.gray,
  padding: "20px"
};
function Charge({amount}) {
  return html`
    <div style=${chargeStyle}>
      <${Typography}>Vänligen slå in så mycket som du velat ladda kortet med och lägg kotet mot läsaren för att påbörja laddningen<//>
      <${Typography}>Ladding: ${amount} kr<//>
    </div>
  `;
}

const warningStyle = {
  ...style.orange,
  padding: "20px",
  position: "absolute",
  bottom: 0,
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
  ...style.gray,
  width: "300px",
  height: "300px",
};
function Body() {
  return html`<div style=${bodyStyle}/>`;
}

module.exports = SwishView;