const { html } = require('htm/react');
const { Fragment, useState } = require('react');
const SlidesView = require('./SlidesView');
const ShoppingView = require('./ShoppingView');
const SwishView = require('./SwishView');
const TransferView = require('./TransferView');
const Paper = require('@material-ui/core/Paper').default;
const style = require("./style");
const RegisterView = require("./RegisterView");

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
  const [{view, args}, setView] = useState({view: "shop", args: []});

  function goTo(view, ...args) {
    setView({view, args});
  }

  let htmlView;
  if(view === "swish") {
    htmlView = html`<${SwishView} setHidden=${setHidden} goTo=${goTo}/>`;
  } else if(view === "register") {
    htmlView = html`<${RegisterView} setHidden=${setHidden} goTo=${goTo} args=${args}/>`
  } else {
    htmlView = html`<${ShoppingView} setHidden=${setHidden} goTo=${goTo}/>`;
  }

  return html`
    <${Paper} style=${style.paper(!hidden)}>
      ${htmlView}
    <//>`;
}

module.exports = Main;