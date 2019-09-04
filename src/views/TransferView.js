const { html } = require('htm/react');
const { useState, useEffect, Fragment } = require('react');
const Typography = require('@material-ui/core/Typography').default;
const {useCardReader} = require('../CardReader');
const {join, split, AlreadyJoinedError, NotJoinedError} = require('../bank');
const {useKeyboard} = require('../keyboard');
const style = require('./style');
const {hideDelay} = require('../config');
const CircularProgress = require('@material-ui/core/CircularProgress').default;

const EMPTY = {select: []};
function TransferView({goBack}) {
  const [state, setState] = useState(EMPTY);

  useEffect(()=>{
    let delay = hideDelay;
    if(state.loading) delay = 60*hideDelay;
    if(state.split) delay = 6*hideDelay;
    if(state.join) delay = 6*hideDelay;
    const key = setTimeout(goBack, delay);
    return ()=> clearTimeout(key);
  });

  function back() {
    setState(EMPTY);
    goBack();
  }

  function set(s) {
    if(s.back) return back();
    setState(s);
  }

  return html`
  <${Fragment}>
    <${Body}/>
    ${state.select && html`<${SelectCards} cards=${state.select} setState=${set}/>`}
    ${state.loading && html`<${Loading}/>`}
    ${state.join && html`<${Join} cards=${state.join} setState=${set}/>`}
    ${state.joined && html`<${Joined} goBack=${back}/>`}
    ${state.split && html`<${Split} cards=${state.split} setState=${set}/>`}
    ${state.splited && html`<${Splited} goBack=${back}/>`}
    ${state.failed && html`<${Failed} goBack=${back}/>`}
  <//>
  `;
}

const canceledStyled = {
  ...style.overlay,
  ...style.red,
};
function Failed({goBack}) {
  useKeyboard(goBack);
  return html`
    <div style=${canceledStyled}>
      <div style=${style.center}>
        <${Typography}>Det gick inte att koppla ihop korten...<//>
        <${Typography}>Kontakta sektionskassören så löser han det!<//>
      </div>
    </div>
  `;
}

const successStyle = {
  ...style.green,
  ...style.overlay,
};
function Joined({goBack}) {
  useKeyboard(goBack);
  return html`
    <div style=${successStyle}>
      <${Typography} style=${style.center}>Dina kort är nu ihopkopplade och kommer att ha samma saldo<//>
    <//>
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


const splitSyle = {
  ...style.overlay,
  ...style.orange
};
function Split({cards, setState}) {
  if(cards.length !== 2) {
    useKeyboard(()=>setState({back:true}));
    return "Invalid state...";
  }

  useKeyboard(async (key)=>{
    if(key === "Backspace") return setState({back: true});
    if(key === "Enter") {
      try {
        setState({loading: true});
        await split(cards[0], cards[1]);
        setState({splited: true})
      } catch(err) {
        console.error(err);
        setState({failed: err})
      }
    }
  });

  return html`
    <div style=${splitSyle}>
      <${Typography} style=${style.box}>Korten verkar redan vara ihopkopplade!<//>
      <${Typography} style=${style.center}>Tryck på ENTER för att särkoppla korten<//>
      <${Typography} style=${style.box}>Det första kortet kommer att behålla kontoladdningen<//>
    <//>
  `;
}

function Splited({goBack}) {
  useKeyboard(goBack);
  return html`
    <div style=${successStyle}>
      <${Typography} style=${style.center}>Dina kort är nu isärkopplade och kommer att olika saldo<//>
    <//>
  `;
}

function Join({cards, setState}) {
  if(cards.length !== 2) {
    useKeyboard(()=>setState({back:true}));
    return "Invalid state...";
  }

  useKeyboard(async (key)=>{
    if(key === "Backspace") return setState({select: cards.slice(0, -1)});
    if(key === "Enter") {
      try {
        setState({loading: true});
        await join(cards[0], cards[1]);
        setState({joined: true})
      } catch(err) {
        console.error(err);
        if(err instanceof AlreadyJoinedError) {
          return setState({split: cards})
        }
        setState({failed: err})
      }
    }
  });

  return html`
    <div style=${style.overlay}>
      <${Typography} style=${style.center}>Tryck på ENTER för att koppla ihop korten<//>
      <div style=${connectedBoxStyle}><${Typography}>Andra kortet läst<//></div>
      <div style=${connectedBoxStyle}><${Typography}>Första kortet läst<//></div>
    <//>
  `;
}

const connectedBoxStyle = {
  ...style.green,
  ...style.box,
};
function SelectCards({cards, setState}) {
  useKeyboard((key)=> {
    if (key === "Backspace") {
      if(cards.length === 0) return setState({back: true});
      return setState({select: cards.slice(0, -1)});
    }
  });

  useCardReader((card) => {
    if(cards.length >= 2) return;
    if(cards.indexOf(card) !== -1) return;
    const newCards = [...cards, card];
    if(cards.length === 1) {
      setState({join: newCards});
    } else {
      setState({select: newCards});
    }
  });

  if(cards.length === 0) {
    return html`
    <div style=${style.overlay}>
      <${Typography} style=${style.center}>Håll upp första kortet<//>
    <//>
  `;
  }
  return html`
    <div style=${style.overlay}>
      <${Typography} style=${style.center}>Håll upp andra kortet<//>
      <div style=${connectedBoxStyle}>
        <${Typography}>Första kortet läst<//>
      </div>
    <//>
  `;
}

const bodyStyle = {
  width: "320px",
  height: "320px",
};
function Body() {
  return html`<div style=${bodyStyle}/>`;
}

module.exports = TransferView;