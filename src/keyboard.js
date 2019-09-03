const { useEffect } = require('react');

function useKeyboard(fn) {
  useEffect(() => {
    function keyDown(event) {
      event.preventDefault();
      fn(event.key);
    }
    document.body.addEventListener("keydown", keyDown);
    return ()=>document.body.removeEventListener("keydown", keyDown);
  });
}

module.exports = {useKeyboard};