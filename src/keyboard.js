const { useEffect } = require('react');

function keymap(key) {
  const map = {
    "1": ["q", "w", "e", "a", "s", "d", "z", "x"],
    "2": ["r", "t", "y", "f", "g", "h", "c", "v", "b"],
    "3": ["u", "i", "o", "j", "k", "l", "n", "m", ","],
    "Enter": ["enter"],
    "Backspace": ["p", "å", "¨", "ö", "ä", "'", ".", "-"],
    "+": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
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

function useKeyboard(fn) {
  useEffect(() => {
    function keyDown(event) {
      event.preventDefault();
      const key = keymap(event.key);
      if(!key) return;
      fn(key);
    }
    document.body.addEventListener("keydown", keyDown);
    return ()=>document.body.removeEventListener("keydown", keyDown);
  });
}

module.exports = {useKeyboard};