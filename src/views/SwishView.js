const { html } = require('htm/react');
const { useState, useEffect, Fragment } = require('react');
const Typography = require('@material-ui/core/Typography').default;
const {useCardReader} = require('../CardReader');
const {pay} = require('../bank');
const {useKeyboard} = require('../keyboard');
const style = require('./style');
const QRCode = require('qrcode');
const {minAmount, maxAmount, hideDelay} = require('../config');
const CircularProgress = require('@material-ui/core/CircularProgress').default;

function generateSwishCode(card, amount) {
  return new Promise((resolve, reject) => {
    const phone = "1235953963";
    const message = `ZKK laddning ${card}`.replace(/ /, "+");
    QRCode.toDataURL(`C${phone};${amount};${message};0`,{} ,(err, code) => {
      if (err) reject(err);
      resolve(code);
    });
  });
}

const EMPTY = {charge: true};
function SwishView({goTo, setHidden}) {
  const [state, setState] = useState(EMPTY);
  const [amount, setAmount] = useState(0);

  function set(key, value) {
    switch(key){
      case "loading": {
        setState({loading: true});
        break;
      }
      case "register": {
        setState(EMPTY);
        goTo("register", value);
        break;
      }
      case "paid": {
        setState({paid: value});
        break;
      }
      case "qr": {
        setState({qr: value});
        break;
      }
      case "failed": {
        setState({failed: true});
        break;
      }
      case "back": {
        setHidden(true);
        setTimeout(() => {
          setState(EMPTY);
          goTo('shop')
        }, 300);
        break;
      }
      default: {
        setState(EMPTY);
        break;
      }
    }
  }


  useEffect(()=>{
    let delay = hideDelay;
    if(state.loading) delay = 60*hideDelay;
    if(state.qr) delay = 30*hideDelay;
    const key = setTimeout(back, delay);
    return ()=> clearTimeout(key);
  });

  function back() {
    set("back");
  }

  return html`
  <${Fragment}>
    <${Body}/>
    ${state.charge && html`<${Charge} amount=${amount} setAmount=${setAmount} set=${set}/>`}
    ${state.qr && html`<${QR} qr=${state.qr} amount=${amount} set=${set}/>`}
    ${state.paid && html`<${Paid} paid=${state.paid} set=${set}/>`}
    ${state.loading && html`<${Loading}/>`}
    ${state.failed && html`<${Failed} set=${set}/>`}
  <//>
  `;
}

const canceledStyled = {
  ...style.overlay,
  ...style.red,
};
function Failed({set}) {
  useKeyboard(()=>set('back'));
  return html`
    <div style=${canceledStyled}>
      <div style=${style.center}>
        <${Typography}>Det gick inte att ladda kortet<//>
        <${Typography}>Om du redan hunnit swisha så är det bara att kontakta sektionskassören så löser hen det<//>
      </div>
    </div>
  `;
}

function Loading() {
  return html`
    <div style=${style.overlay}>
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
function Paid({paid, set}) {
  useKeyboard(()=>set('back'));
  return html`
    <div style=${style.overlay}>
      <${Typography} variant="h2" style=${style.center}>${paid.balance} kr<//>
      <div style=${paidBoxStyle}>
        <${Typography}>Grattis! Ditt kort är nu laddat med följande belopp<//>
      </div>
    <//>
  `;
}

const qrImageStyle = {
  height: "130px",
};
const qrBoxStyle = {
  ...style.gray,
  ...style.box,
};
function QR({qr, amount, set}) {
  const {card, code} = qr;
  useKeyboard(async (key)=>{
    if(key === "+") {
      try {
        set("loading");
        const balance = await pay(card, -amount);
        if(balance !== false) {
          set("paid", {balance, amount});
        } else {
          set("register", card);
        }
      } catch (err) {
        console.error(err);
        set("failed", err);
      }
    }
    if(key === "Backspace") return set();
  });

  return html`
    <div style=${style.overlay}>
      <div style=${style.centerH}>
        ${code && html`<img style=${qrImageStyle} src=${code}/>`}
      </div>
      <${Typography} variant="h2" style=${style.center}>${amount} kr<//>
      <div style=${qrBoxStyle}>
        <${Typography} style=${style.centerH}>Betala genom att scanna QR koden med swish. Tryck sedan på LADDA för att föra in pengarna på ditt konto.<//>
        <${Typography} style=${style.centerH}>(Vi kollar inte om pengarna är betalda utan litar på dig!)<//>
      </div>
    <//>
  `;
}

const warningStyle = (show)=>({
  ...style.orange,
  ...style.box,
  opacity: show ? 1 : 0
});
function Charge({amount, set, setAmount}) {
  useCardReader( async (card)=>{
    if(amount < minAmount || amount > maxAmount) return;
    try {
      const code = await generateSwishCode(card, amount);
      set("qr", {code, card});
    } catch(err) {
      console.error(err);
      set("failed", err);
    }
  });

  useKeyboard(async (key)=>{
    const number = Number.parseInt(key);
    if (!Number.isNaN(number)) {
      const newAmount = amount * 10 + number;
      if (amount === 0) return setAmount(number);
      return setAmount(newAmount);
    }
    if (key === "Backspace") {
      if (amount === 0) return set("back");
      const newAmount = Math.floor(amount / 10);
      return setAmount(newAmount);
    }
  });

  let warning;
  if(amount > maxAmount) warning = `Högsta laddningsbeloppet är ${maxAmount}kr`;
  if(amount < minAmount) warning = `Minsta laddningsbeloppet är ${minAmount}kr på grund av swishavgifter`;

  return html`
    <div style=${style.overlay}>
      <${Typography} style=${style.box}>Vänligen slå in så mycket som du velat ladda kortet med och visa sedan upp ditt kort för läsaren<//>
      <${Typography} variant="h2" style=${{...style.center, justifyContent: "unset"}}>${amount} kr<//>
      <div style=${warningStyle(!!warning)}>
        <${Typography}>${warning || '-'}<//>
      </div>
    </div>
  `;
}

const bodyStyle = {
  width: "320px",
  height: "370px",
};
function Body() {
  return html`<div style=${bodyStyle}/>`;
}

module.exports = SwishView;