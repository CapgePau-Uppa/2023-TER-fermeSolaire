import { Injectable } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import HeatMap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import Layer from 'ol/layer/Layer';
import TileSource from 'ol/source/Tile';



@Injectable({
  providedIn: 'root'
})
export class LayersListService {

  Blur: number = 0;
  radius: number = 2;


  LayersList: Layer[] = [
    new HeatMap({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'http://localhost:3000/tminsolc'
      }),
      visible: false,
      blur: this.Blur,
      opacity: 1,
      radius: this.radius, weight: function (feature) {
        return ((feature.getProperties()['tminsolc'] + 5) / 10);
      },
      properties: { text: "Température minimum au sol", min: "-5°", max: "5°", id: "tempS" }
    }),
    new HeatMap({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'http://localhost:3000/n'
      }),
      visible: false,
      blur: this.Blur,
      radius: this.radius, weight: function (feature) {
        return (feature.getProperties()['n'] / 100);
      },
      properties: { text: "Nebulosité", min: "0%", max: "100%", id: "nebulosity" }
    }),
    new HeatMap({
      source: new VectorSource({
        format: new GeoJSON(),
        url: 'http://localhost:3000/tc'
      }),
      visible: false,
      blur: this.Blur,
      radius: this.radius,
      weight: function (feature) {
        return ((feature.getProperties()['tc']) / 10);
      },
      properties: { text: "Température de l'air", min: "0°c", max: "10°c", id: "temperature" }
    })
  ];

  updateRadius(radius : number) {
    this.radius = radius;
    this.LayersList.forEach((heatmap) => {
      heatmap.set('radius', radius); 
    })
  }
}
