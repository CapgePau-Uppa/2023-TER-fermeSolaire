import { Injectable } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import HeatMap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import Layer from 'ol/layer/Layer';


@Injectable({
  providedIn: 'root'
})
export class LayersListService {

  LayersList : Layer[] = [
    new TileLayer({
      source: new OSM(),
    }),
    new HeatMap({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-03-04T23%3A00%3A00Z+TO+2023-03-05T22%3A59%3A59Z%5D&lang=fr&rows=500&facet=nom&facet=tminsol&fields=tminsolc,coordonnees&format=geojson'
        //url: 'http://localhost:3000/geojson'
      }),
      visible: false,
      blur: 10,
      radius: 5,
      weight: function (feature) {
        return ((feature.get('tminsolc') + 10) / 20);
      },
      properties : {name : "GroundTemp", min : "-10°" , max : "10°"}
    }),
    new HeatMap({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-03-04T23%3A00%3A00Z+TO+2023-03-05T22%3A59%3A59Z%5D&lang=fr&rows=500&facet=nom&facet=tminsol&fields=n,coordonnees&format=geojson'
        //url: 'http://localhost:3000/geojson'
      }),
      visible: false,
      blur: 10,
      radius: 5,
      weight: function (feature) {
        return ((feature.get('n')) / 100);
      },
      properties : {name : "Nebulosity", min : "0%", max : "100%"}
    })
  ];

  
    // fetch('http://localhost:3000/geojson')
    //   .then(response => response.json())
    //   .then(data => console.log("Here is the GeoJSON fetched :", data))
    //   .catch(error => console.error(error));

}
