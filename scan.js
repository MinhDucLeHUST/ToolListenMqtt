const net = require('net');
const { promisify } = require('util');

const ipAddressRange = '192.168.88.';
const startPort = 100;
const endPort = 200;

const scanPort = async (ipAddress, port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);

        socket.on('connect', () => {
            socket.end();
            resolve({ ipAddress, port, status: 'open' });
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve({ ipAddress, port, status: 'closed' });
        });

        socket.on('error', (err) => {
            resolve({ ipAddress, port, status: 'closed' });
        });

        socket.connect(port, ipAddress);
    });
};

const scanIPRange = async () => {
    const promises = [];

    for (let i = startPort; i <= endPort; i++) {
        const ipAddress = `${ipAddressRange}${i}`;
        promises.push(scanPort(ipAddress, i));
    }

    const results = await Promise.all(promises);
    console.log(results);
};

scanIPRange();
