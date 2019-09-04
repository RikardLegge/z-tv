const { html } = require('htm/react');
const { Fragment, useState } = require('react');
const SlidesView = require('./SlidesView');
const ShoppingView = require('./ShoppingView');
const SwishView = require('./SwishView');
const TransferView = require('./TransferView');
const Paper = require('@material-ui/core/Paper').default;
const style = require("./style");

const fillStyle = {
  position: "absolute",
  bottom: "0",
  left: "0",
  top: "0",
  right: "0",
};

function Main() {
  return html`
    <${Fragment}>
      <${SlidesView}><//>
      <div style=${fillStyle}>
        <${Popup}/>
      </div>
    <//>`;
}

function Popup() {
  const [hidden, setHidden] = useState(true);
  const [view, setView] = useState("shop");

  function goToShop() {
    setHidden(true);
    setTimeout(() => setView("shop"), 300);
  }

  let htmlView;
  if(view === "swish") {
    htmlView = html`<${SwishView} goBack=${goToShop}/>`;
  } else if(view === "transfer") {
    htmlView = html`<${TransferView} goBack=${goToShop}/>`
  } else {
    htmlView = html`<${ShoppingView} setHidden=${setHidden} goTo=${setView}/>`;
  }

  return html`
    <${Paper} style=${style.paper(!hidden)}>
      ${htmlView}
    <//>`;
}

module.exports = Main;