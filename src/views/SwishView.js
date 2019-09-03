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
    const clear = () => setHidden(true);
    const key = setTimeout(clear, 60000);
    return ()=> clearTimeout(key);
  }, [amount, warning]);

  useCardReader( async (card)=>{
    if(state.qr) {
      try {
        setState({paying: true});
        const balance  = await bank.pay(card, -amount);
        setState({paid: {balance, amount}})
      } catch(err) {
        console.error(err);
        setState({failed: err})
      }
    }
  });

  useKeyboard((key)=>{
    console.log(key);
    setWarning(null);
    if(state.qr) {
      switch(key) {
        case "Enter": {
          return;
        }
        case "Backspace": {
          return setState(EMPTY);
        }
      }
    }

    let number = Number.parseInt(key);
    if(!Number.isNaN(number)) {
      if(amount === 0) return setAmount(number);
      const newAmount = amount * 10 + number;
      if(newAmount > 500) setWarning("Endast 500kr kommer att sättas in på ditt konto");
      return setAmount(newAmount);
    }

    switch(key) {
      case "Enter": {
        let money = amount;
        if (money < 50) {
          return setWarning("Du måste ladda kortet med iallafall 50kr");
        }
        if (money > 500) {
          money = 500;
        }
        const phone = "0702005536";
        const message = "Till Zkk och vidare".replace(/ /, "+");
        QRCode.toDataURL(`C${phone};${money};${message};0`, function (err, qr) {
          setState({qr});
        });
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
      <${Warning}/>
      ${state === EMPTY && html`<${Charge} amount=${amount}/>`}
      ${state.qr && html`<${QR} qr=${state.qr}/>`}
      ${state.paid && html`<${Paid} paid=${state.paid}/>`}
      ${state.paying && html`<${Paying}/>`}
      ${state.failed && html`<${Failed}/>`}
    <//>
    `;
}

const canceledStyled = {
  ...style.fill,
  background: "rgb(180,0,0,0.95)",
  color: "white",
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

function Paid({paid}) {
  return html`
    <div style=${payingStyle}>
      <${Typography}>Grattis, Ditt kort är nu laddat!<//>
      <${Typography}>Betalt: ${paid.amount} kr<//>
      <${Typography}>Kontobalans: ${paid.balance} kr<//>
    </div>
  `;
}

function QR({qr}) {
  return html`
    <div style=${chargeStyle}>
      <${Typography}>Lägg ditt kort på läsaren när du är färdig med swishen för att föra in pengarna på ditt konto<//>
      ${qr && html`<img src=${qr}/>`}
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
      <${Typography}>Vänligen slå in så mycket som du velat ladda korted med: [50, 500]kr<//>
      <${Typography}>${amount} kr<//>
    </div>
  `;
}

const warningStyle = {
  ...style.gray,
  padding: "20px"
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