var SerialPort = require("serialport").SerialPort;
var connect = require('connect');
var serveStatic = require('serve-static');
var WebSocket = require('ws');

connect().use(serveStatic('./public')).listen(5000);

var clientSock;

wss = new WebSocket.Server({port: 5005});
wss.on('connection', function(ws) {
  clientSock = ws;
  console.log('client data socket connected');
});
wss.on('close', function() {
  console.log('closed');
  clientSock = undefined;
});

var serial = new SerialPort("/dev/ttyACM0", {
  baudrate: 38400 
});

var serialBuf = "";

serial.on("open", function () {
  console.log('open');
  serial.on('data', function(data) {
    //console.log(data);
    if (!clientSock || clientSock.readyState != WebSocket.OPEN) return; 
    
    serialBuf += data;
     
    var ixNewline;
    while (true) {
      ixNewline = serialBuf.indexOf('\n');
      if (ixNewline == 0) serialBuf = serialBuf.substring(1);
      else break;
    }
    
    if (ixNewline > 0) {
      var datum = serialBuf.substring(0, 1+ixNewline);
      //console.log(datum);
      //if (!clientSock) return;
      clientSock.send(datum);
      serialBuf = serialBuf.substring(ixNewline);
    }
  });
});

