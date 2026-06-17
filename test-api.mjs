import http from 'http';

const data = JSON.stringify({ "0": { "id": "test" } });

const req = http.request({
  hostname: 'localhost',
  port: 8000,
  path: '/trpc/corsairGmail.connectGmail?batch=1',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Origin': 'http://localhost:3000'
  }
}, (res) => {

  res.setEncoding('utf8');
  res.on('data', (chunk) => {

  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
