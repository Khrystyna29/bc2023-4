const http = require('http');
const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const he = require('he');
const builder = require('xmlbuilder');

const PORT = 8000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile('data.xml', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the XML file', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                const jsonObj = xmlParser.parse(data);
                const filteredValues = jsonObj.indicators.inflation.filter(
                    (item) => item.ku === 13 && parseFloat(item.value) > 5
                );

                const root = builder.create('data');
                filteredValues.forEach((item) => {
                    root.ele('value', {}, he.encode(item.value.toString()));
                });

                const transformedXml = root.end({ pretty: true });

                res.writeHead(200, { 'Content-Type': 'application/xml' });
                res.end(transformedXml);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
