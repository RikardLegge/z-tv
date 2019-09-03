const ReactDOM = require('react-dom');
const { html } = require('htm/react');
const Main = require('./views/Main');

const root = document.querySelector("#root");
ReactDOM.render(html`<${Main}><//>`, root);
