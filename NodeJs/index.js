const { count } = require('console');
const http = require('http');
const request = require('request');
const fs = require('fs');

var cubicSpline = require('cubic-spline');
var splitArray = require('split-array');

function interpolateArray(data, n) {
  //interploation of simple row or column
  function interpoalateDirection(axis, Z, n) {
      var ZNew = [];
      for (var i = 0; i < Z.length - 1; i++) {
          ZNew.push(Z[i]);
          for (var j = 0; j < n; j++) {
              ZNew.push((0, cubicSpline.default)(axis[i] + (axis[i + 1] - axis[i]) / (n + 1) * (j + 1), axis, Z));
          }
      }
      ZNew.push(Z[Z.length - 1]);
      return ZNew;
  }
  //interpolate arguments array (axis)
  function interpolateAxis(axis, n) {
      var newAxis = [];
      for (var i = 0; i < axis.length - 1; i++) {
          newAxis.push(axis[i]);
          for (var j = 0; j < n; j++) {
              newAxis.push(axis[i] + (axis[i + 1] - axis[i]) / (n + 1) * (j + 1));
          }
      }
      newAxis.push(axis[axis.length - 1]);
      return newAxis;
  }

  //sort data firstly by x and then by y
  data.sort(function (a, b) {
      //sort firstly by 1st column, if equal then sort by second column
      return a.x - b.x || a.y - b.y;
  });
  //dissasemble object
  var X = [];
  var Y = [];
  var Z = [];
  var X2 = [];
  var Y2 = [];
  var Z2 = [];
  var Z3 = [];
  var dataInt = [];
  data.map(function (record) {
      if (X.indexOf(record.x) === -1) {
          X.push(record.x);
      }
      return record;
  });
  data.map(function (record) {
      if (Y.indexOf(record.y) === -1) {
          Y.push(record.y);
      }
      return record;
  });
  data.map(function (record) {
      if (true) {
          Z.push(record.z);
      }
      return record.z;
  });
  Z = splitArray(Z, Y.length); // nouvelle version, tester
    //interpolate along columns
  var interpColumns = [];
  for (var i = 0; i < Y.length; i++) {
      var tempZ = [];
      for (var j = 0; j < X.length; j++) {
          tempZ.push(Z[j][i]);
      }
      interpColumns.push(interpoalateDirection(X, tempZ, n));
  }
  //interpolate along rows
  for (var _i = 0; _i < interpColumns[0].length; _i++) {
      var row = [];
      for (var _j = 0; _j < interpColumns.length; _j++) {
          row.push(interpColumns[_j][_i]);
      }
      Z2.push(row);
  }
  Z3 = Z2.map(function (row) {
      return interpoalateDirection(Y, row, n);
  });
  //interpolate arguments x and y
  X2 = interpolateAxis(X, n);
  Y2 = interpolateAxis(Y, n);
  //assemble data object
  for (var y = 0; y < Y2.length; y++) {
      for (var x = 0; x < X2.length; x++) {
          dataInt.push({
              x: X2[x],
              y: Y2[y],
              z: Z3[x][y]
          });
      }
  }
  if (n===0) {
      return data;
  } else {
      return dataInt;
  }
};

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
          return result.coordinates[0] === coordinates[0] && result.coordinates[1] === coordinates[1];
        });

        // If the coordinates already exist, add the value of the sum and increment the count
        if (existingCoordIndex !== -1) {
          results[existingCoordIndex].sum += value;
          results[existingCoordIndex].count++;
        }
        // Else, create a new object
        else {
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

    // Create a new GeoJSON object with an empty features array
    const generatedGeojson = {
      type: 'FeatureCollection',
      features: []
    };

    // Loop through the data array and create a new GeoJSON feature for each object
    results.forEach((obj) => {
      const feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: obj.coordinates
        },
        properties: {
          date: obj.date,
          count: obj.count,
          average: obj.average
        }
      };
      generatedGeojson.features.push(feature); // Add the feature to the features array
    });

    const geojsonStringify = JSON.stringify(generatedGeojson);
    // Write the result array to a file
    fs.writeFile('data.geojson', geojsonStringify, (err) => {
      if (err) throw err;
      console.log('geojson saved to data file');
    });
    console.log(geojsonStringify);
    return generatedGeojson;
};

function interpolateGeoJSON(geojsonBody, propertyToInterpolate) {
  const geojson = JSON.parse(geojsonBody); // Parse the response body as JSON
  const features = geojson.features;


  const inputGrid = []; // Input grid to interpolate
  const sizeOutputGrid = 5;

  features.forEach(feature => {
    const coordinates = feature.geometry.coordinates;
    const value = feature.properties[propertyToInterpolate];

    inputGrid.push({
      x: coordinates[0],
      y: coordinates[1],
      z: value
    });
  });
  

  const interpolatedValues = interpolateArray(inputGrid, sizeOutputGrid);

  console.log(interpolatedValues);


};


// Make an HTTP request to the GeoJSON endpoint
request('https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=tminsolc,coordonnees,date&format=geojson', (error, response, body) => {
  if (!error && response.statusCode === 200) {
    calculateAverage(body,'tminsolc');
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
      fs.readFile('data.geojson', 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Error reading file');
        } else {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // to allow cross-origin requests
        });
          res.end(data);
        }
      });

      console.log('ici les valeurs interpolées');

      const geojsonAveraged = fs.readFileSync('data.geojson', 'utf8');
      interpolateGeoJSON(geojsonAveraged, 'tminsolc');
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
