const http = require('http');
const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const he = require('he');

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
                console.log(jsonObj.indicators.inflation)
                const filteredValues = jsonObj.indicators.inflation.filter(
                    (item) => item.ku === 13 && parseFloat(item.value) > 5
                );
                const transformedXml = `<data>\n${filteredValues
                    .map((item) => `  <value>${he.encode(item.value.toString())}</value>`)
                    .join('\n')}\n</data>`;

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
