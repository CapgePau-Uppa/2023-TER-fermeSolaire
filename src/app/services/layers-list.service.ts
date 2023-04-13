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
      properties : {text : "Température minimum au sol", min : "-10°" , max : "10°" , id : "tempS"}
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
      properties : {text : "Nebulosité", min : "0%", max : "100%" , id : "nebulosity"}
    }),
    new HeatMap({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-02-28T23%3A00%3A00Z+TO+2023-03-08T22%3A59%3A59Z%5D&rows=4000&facet=date&facet=nom&facet=temps_present&facet=libgeo&facet=nom_epci&facet=nom_dept&facet=nom_reg&fields=tc,coordonnees&format=geojson'
        //url: 'http://localhost:3000/geojson'
      }),
      visible: false,
      blur: 10,
      radius: 5,
      weight: function (feature) {
        return ((feature.get('tc') -5) / 40);
      },
      properties : {text : "Température de l'air", min : "5°c", max : "35°c" , id : "temperature"}
    })
  ];
}
