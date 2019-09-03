const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const { useEffect } = require('react');

class CardReader {
  constructor() {
    this.reader = null;
  }

  listen(fn) {
    if(this.reader) return;
    SerialPort.list((err, ports) => {
      if(this.reader) return;
      if(err) {
        throw new Error("Failed to list ports: " + err);
      }
      console.log('Found ports', ports);

      const cardReaderPort = ports.find(p => p.manufacturer === "Olimex Ltd");
      const cardReader = new SerialPort(cardReaderPort.comName, {baudRate: 115200});
      if(!cardReader) throw new Error("Could not find card reader");
      console.log("Connected to card reader!");

      const parser = new Readline();
      cardReader.pipe(parser);
      parser.on('data', line => {
        line = line.trim();
        if(line === "") return;
        if(line === ">") return;
        if(line.indexOf("ERR") === 0) return;
        fn(line);
      });
    });
  }

  unListen() {
    if(this.reader) {
      console.log("Disconnecting from card reader...");
      this.reader.close();
      this.reader = null;
      console.log("Disconnected!");
    }
  }
}

let reader;
let readerFn = ()=>{};
function useCardReader(fn) {
  useEffect(() => {
    if(!reader) {
      reader = new CardReader();
      reader.listen((card)=>readerFn(card));
    }
    readerFn = fn;
    return ()=> {readerFn = ()=>{}};
  });
}

module.exports = {useCardReader, CardReader};