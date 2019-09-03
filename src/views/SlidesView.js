const { html } = require('htm/react');
const { useState, useEffect } = require('react');

const url = "https://docs.google.com/presentation/d/e/2PACX-1vSqzhgcEbLVwCapnGT7FWeHeDvagdWR5ZX_qVt8_6wBjsC_YEiH5mE6Pi4OJxDCNX0-yAjqwCiStwyH/pub?start=true&loop=true&delayms=10000&rm=minimal";

const style = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: "0",
  left: "0",
};
module.exports = function SlidesView(){
  const newFrame = () => html`<iframe key=${Math.random()} src=${url} frameBorder="0" style=${style}></iframe>`;
  const [frames, setFrames] = useState([newFrame(), newFrame()]);

  useEffect(()=>{
    function reverseFrames() {
      console.log("Updated slideshow");
      setFrames([
        newFrame(),
        frames[0]
      ]);
    }
    const key = setTimeout(reverseFrames, 60000);
    return ()=> clearTimeout(key);
  }, [frames]);

  return frames;
};
