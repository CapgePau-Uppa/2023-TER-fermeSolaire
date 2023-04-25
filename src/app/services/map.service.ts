import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import Zoom from 'ol/control/Zoom.js';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { LayersListService } from './layers-list.service';
import ScaleLine from 'ol/control/ScaleLine.js';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  map = new Map({
    view: new View({
      center: fromLonLat([-0.363269, 43.319188]),
      zoom: 5,
    }),
    layers: [new TileLayer({
      source: new OSM(),
    })],
    controls: [
      new Zoom({
        className: "zoom-buttons"
      }),
    ]
  });

  constructor(private layersListService : LayersListService) {
    layersListService.LayersList.forEach(element => {
      this.map.addLayer(element);
    });
  }

  

}
