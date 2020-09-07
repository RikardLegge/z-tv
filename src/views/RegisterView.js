const { html } = require('htm/react');
const { useState, useEffect } = require('react');
const Typography = require('@material-ui/core/Typography').default;
const {useKeyboard} = require('../keyboard');
const style = require('./style');
const QRCode = require('qrcode');
const {hideDelay} = require('../config');

function generateLinkCode(card) {
  return new Promise((resolve, reject) => {
    if(!card) throw new Error("Invalid card number");
    const url = "https://zkk-tv.web.app?card=" + card ;
    QRCode.toDataURL(url,{} ,(err, code) => {
      if (err) reject(err);
      resolve(code);
    });
  });
}

function RegisterView({goTo, setHidden, args}) {
  const card = args[0];
  const [qr, setQR] = useState(null);

  useEffect(()=>{
    let delay = 5*hideDelay;
    const key = setTimeout(back, delay);
    return ()=> clearTimeout(key);
  });
  useKeyboard(back);

  function back() {
    setHidden(true);
    setTimeout(() => goTo('shop'), 300);
  }

  useEffect(()=>{
    generateLinkCode(card).then(setQR);
  }, [])

  return html`
    <div style=${style.layer}>
      <div style=${style.centerH}>
        ${qr && html`<img style=${{height: "130px"}} src=${qr}/>`}
      </div>
      <div style=${{padding: "5px"}}>
      <${Typography}>Gå in på följande länk för att registrera ett konto.<//>
      <${Typography}>Tryck sedan på valfri tangent och pröva sedan igen.<//>
      </div>
    <//>
  `;
}

module.exports = RegisterView;