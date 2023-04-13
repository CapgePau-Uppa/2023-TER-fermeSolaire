const http = require('http');
const request = require('request');
const fs = require('fs');
const {interpolateArray} = require('2d-bicubic-interpolate');


function calculateAverage(geojsonBody, propertyToAverage) {
    const geojson = JSON.parse(geojsonBody); // Parse the response body as JSON
    const features = geojson.features;

    const results = []; // Table to stock the result of each coordinate

    features.forEach(feature => {
      if (feature.properties[propertyToAverage] != undefined) {
        const coordinates = feature.geometry.coordinates;
        const value = feature.properties[propertyToAverage];
        const date = feature.properties['date'];
        
        // Verify if coordinates already exist in results table
        const existingCoordIndex = results.findIndex(result => {
          console.log(result.coordinates[0]);
          console.log(result.coordinates[1]);
          console.log(coordinates[0]);
          console.log(coordinates[1]);
          return result.coordinates[0] === coordinates[0] && result.coordinates[1] === coordinates[1];
        });

        // If the coordinates already exist, add the value of the sum and increment the count
        if (existingCoordIndex !== -1) {
          results[existingCoordIndex].sum += value;
          results[existingCoordIndex].count++;
          // results[existingCoordIndex].average = this.sum/this.count;
        }
        // Else, create a new object
        else {
          console.log('coordonnées crées');
          results.push({
            coordinates: coordinates,
            date: date,
            sum: value,
            count: 1,
            average: value
          });
        }
      }
    });
    results.forEach(result => {
      result.average = result.sum / result.count;
      delete result.sum;
    });

    console.log(results);

    // Write the result array to a file
    fs.writeFile('data', JSON.stringify(results), (err) => {
      if (err) throw err;
      console.log('Results array saved to data file');
    });

    return results;
};

function readFile() {  
  return new Promise (resolve => {
    fs.readFile('data',(err, data) => {
    if (err) throw err;
    resolve(JSON.parse(data));
    })
  });
}

async function getData(){
  const data = await readFile();
  let formatedData = [];
  data.forEach(currentObject => {
    formatedData.push({
      x : currentObject.coordinates[0],
      y : currentObject.coordinates[1],
      z : currentObject.average
    })
  });
  return formatedData;
}

function makeGeoJSON() {
  console.log(interpolateArray(getData(), 1));
};

// Make an HTTP request to the GeoJSON endpoint
request('https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=tminsolc,coordonnees,date&format=geojson', (error, response, body) => {
  if (!error && response.statusCode === 200) {
    //calculateAverage(body,'tminsolc');
    makeGeoJSON();
  } else {
    console.error(error);
  }
});

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/geojson':
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
      break;
  
    case '/average':
      console.log('ici la moyenne');
      request('https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=tminsolc,coordonnees,date&format=geojson', (error, response, body) => {
        if (!error && response.statusCode === 200) {
          calculateAverage(body,'tminsolc');
        } else {
          console.error(error);
        }
      });
      break;

    default:
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('Not found');
      break;
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

/* setInterval(() => {
  console.log('Running code every 5 seconds');
}, 5000); */