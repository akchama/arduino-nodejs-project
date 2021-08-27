var http = require('http');
var fs = require('fs');

var index = fs.readFileSync('index.html');

var SerialPort = require('serialport');

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('COM4', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);


var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(index);
});

var io = require('socket.io')(app);

io.on('connection', function(data) {
    console.log('Node.js dinlemeye basladi');
});

parser.on('data', function(data) {
    var json = data;
    try {
        var parsed = JSON.parse(json);
    } catch (e) {
        return false;
    }
    console.log("Pot: " + parsed.pot + ", Sıcaklık: " + parsed.sicaklik);
    io.emit('data', data);
});

app.listen(3000);