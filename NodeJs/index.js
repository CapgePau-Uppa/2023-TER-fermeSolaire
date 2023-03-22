const http = require('http');
const request = require('request');

const server = http.createServer((req, res) => {
  if (req.url === '/geojson') {
    request('  https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=tminsolc,coordonnees&format=geojson', (error, response, body) => {
      if (!error && response.statusCode === 200) {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // to allow cross-origin requests
        });
        res.end(body);
      } else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Error fetching GeoJSON file');
      }
    });
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});