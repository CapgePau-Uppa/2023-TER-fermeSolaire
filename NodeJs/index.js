import http from 'http';
import request from 'request';
import fs from 'fs';
import * as turf from '@turf/turf';


function calculateAverage(geojsonBody, propertyToAverage) {
  const geojson = JSON.parse(geojsonBody); // Parse the response body as JSON
  const features = geojson.features;
  let results = turf.featureCollection([]);

  features.forEach(feature => {
    if (feature.properties[propertyToAverage] != undefined) {
      const coordinates = feature.geometry.coordinates;
     if(coordinates[0] < 9.50245 && coordinates[0] > -6.12010 && coordinates[1] > 41.53257 && coordinates[1] < 51.70605 )
     {
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
         console.log('coordonnées crées');
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
    console.log('Results array saved to data file');
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
    const options = { gridType: 'points', property: name, units: 'kilometers' };
    const grid = turf.interpolate(json, 10, options);
    writeFile(name, grid);
    let dateFileName = name + 'Date';
    const dateFileData = {
      date: null,
    };
    let dateFile;
    json.features.forEach(async feature => {
      dateFileData.date = feature.properties.date;
      console.log(new Date(dateFileData.date));
      fs.access(dateFileName, fs.constants.F_OK, async (err) => {
        if (err){
          console.log("creating file");
          writeFile(dateFileName, dateFileData);
        } else {
          dateFile = await getData(dateFileName);
          console.log(new Date(dateFileData.date));
          if (new Date(dateFileData.date) > new Date(dateFile.date)){
            console.log('later date');
            writeFile(dateFileName, dateFileData);
          }
        }
      });
    });
    console.log(dateFileData);
    
  })()
};


//Make an HTTP request to the GeoJSON endpoint
request('https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=tminsolc,coordonnees,date&format=geojson', (error, response, body) => {
  if (!error && response.statusCode === 200) {
    makeGeoJSON(body, 'tminsolc');
  } else {
    console.error(error);
  }
});


const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case '/geojson':
      request('  https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=tminsolc&format=geojson', (error, response, body) => {
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
          //calculateAverage(body, 'tminsolc');
        } else {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // to allow cross-origin requests
        });
          res.end(data);
        }
      });

      console.log('ici les valeurs interpolées');

      /*const geojsonAveraged = fs.readFileSync('data.geojson', 'utf8');
      interpolateGeoJSON(geojsonAveraged, 'tminsolc');*/
      break;

    case '/tminsolc':
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // to allow cross-origin requests
      });
      res.end(JSON.stringify(await getData('tminsolc')));
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


