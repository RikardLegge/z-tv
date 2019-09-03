const { html } = require('htm/react');
const { Fragment, useState } = require('react');
const SlidesView = require('./SlidesView');
const ShoppingView = require('./ShoppingView');
const SwishView = require('./SwishView');

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
  if(view === "swish")
    return html`<${SwishView} goBack=${()=>setView("shop")} 
                              hidden=${hidden} 
                              setHidden=${setHidden}/>`;
  return html`<${ShoppingView} goBack=${()=>setView("swish")}
                               hidden=${hidden}
                               setHidden=${setHidden}/>`;
}

module.exports = Main;