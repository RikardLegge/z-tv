const { useEffect } = require('react');

function keymap(key) {
  const map = {
    "1": ["q", "w", "e", "a", "s", "d", "z", "x", "1"],
    "2": ["r", "t", "y", "f", "g", "h", "c", "v", "b", "2"],
    "3": ["u", "i", "o", "j", "k", "l", "n", "m", ",", "3"],
    "4": ["4"],
    "5": ["5"],
    "6": ["6"],
    "7": ["7"],
    "8": ["8"],
    "9": ["9"],
    "0": ["0"],
    "+": ["+"],
    "#": ["#"],
    "Enter": ["enter"],
    "Backspace": ["p", "å", "¨", "ö", "ä", "'", ".", "-", "backspace"],
  };
  key = key.toLowerCase();

  for(let [k, letters] of Object.entries(map)) {
    for(let l of letters) {
      if(l === key) {
        return k;
      }
    }
  }
}

let debounce = false;
function useKeyboard(fn) {
  useEffect(() => {
    function keyDown(event) {
      event.preventDefault();
      const key = keymap(event.key);
      if(!key) return;

      if(debounce) return;
      debounce = true;
      setTimeout(()=>debounce = false, 250);

      console.log(key);
      fn(key);
    }
    document.body.addEventListener("keydown", keyDown);
    return ()=>document.body.removeEventListener("keydown", keyDown);
  });
}

module.exports = {useKeyboard};