const { html } = require('htm/react');

const url = "https://docs.google.com/presentation/d/e/2PACX-1vSqzhgcEbLVwCapnGT7FWeHeDvagdWR5ZX_qVt8_6wBjsC_YEiH5mE6Pi4OJxDCNX0-yAjqwCiStwyH/pub?start=true&loop=true&delayms=10000";

module.exports = function SlidesView(){
  const style = {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "0",
  };
  return html`
      <iframe src=${url} frameBorder="0" style=${style}></iframe>
    `;
};
