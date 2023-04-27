import http from 'http';
import request from 'request';
import fs from 'fs';
import * as turf from '@turf/turf';

const FILTERS = ['tminsolc', 'n', 'tc'] //List of the filters you want to use. (Use the opendatasoft synop syntaxe)
const INTERPOLATION_FACTOR = 4; // See https://turfjs.org/docs/#interpolate for more informations (it's the weight)
const INTERPOLATION_PRECISION = 4; // See https://turfjs.org/docs/#interpolate for more informations (it's the cell size)

function calculateAverage(geojsonBody, propertyToAverage) {
  const geojson = JSON.parse(geojsonBody); // Parse the response body as JSON
  const features = geojson.features;
  let results = turf.featureCollection([]);

  features.forEach(feature => {
    if (feature.properties[propertyToAverage] != undefined) {
      const coordinates = feature.geometry.coordinates;
      if (coordinates[0] < 9.50245 && coordinates[0] > -5.86954 && coordinates[1] > 41.53257 && coordinates[1] < 51.70605) {
        // Verify if coordinates already exist in results table
        let existingCoord = false;
        results.features.forEach((element) => {
          if (JSON.stringify(element.geometry.coordinates) == JSON.stringify(coordinates)) {
            existingCoord = true;
            element.properties[propertyToAverage] += feature.properties[propertyToAverage];
            element.properties.count += 1;
          }
        });

        if (!existingCoord) {
          feature.properties.count = 1;
          results.features.push(feature);
        }
      }
    }
  });

  results.features.forEach(element => {
    element.properties[propertyToAverage] = element.properties[propertyToAverage] / element.properties['count'];
  });

  return results;
};

function writeFile(fileName, data) {
  // Write the result array to a file
  fs.writeFile(fileName, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(fileName + ' saved.');
  });
}

function deleteFile(fileName) {
  if (fs.existsSync(fileName)) {
    fs.unlink(fileName, (err) => {
      if (err) throw err;
    });
  }
}


function readFile(fileName) {
  return new Promise(resolve => {
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      resolve(JSON.parse(data));
    })
  });
}

/**
 * Use the readFile function to get the datas from the data file and then format it
 * @returns Data from the data file in this format : [{x,y,z},...]
 */
async function getData(fileName) {
  const data = await readFile(fileName);
  return data;
}
/**
 * Create a new file 'name' containing the interpolated GeoJSON for propertyToInterpolate.
 * @param {JSON} data  The JSON containing the data from the API (should be removed)
 * @param {String} name  The name of the property you want to interpolate
 */
function makeGeoJSON(data, name) {
  (async () => {
    deleteFile(name);
    let json = calculateAverage(data, name);
    const options = { gridType: 'points', property: name, units: 'kilometers', weight: INTERPOLATION_FACTOR};
    const grid = turf.interpolate(json, INTERPOLATION_PRECISION, options);
    writeFile(name, grid);
  })()
};


//Create all geojsons on server start
FILTERS.forEach( (filtre) => {
  let requete = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=' + filtre + ',coordonnees,date&format=geojson'
  request(requete, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      makeGeoJSON(body, filtre);
    } else {
      console.error(error);
    }
  });
})



const server = http.createServer(async (req, res) => {
  let found = false;
  FILTERS.forEach(async (filtre) => {
    if (req.url == "/" + filtre) {
      found = true;
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // to allow cross-origin requests
      });
      res.end(JSON.stringify(await getData(filtre)));
    }
  })
  if (!found) {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('Not found');
  }
  else console.log('file sent');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
