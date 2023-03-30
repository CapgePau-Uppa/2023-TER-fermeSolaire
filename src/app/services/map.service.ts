import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import Zoom from 'ol/control/Zoom.js';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { LayersListService } from './layers-list.service';
import ScaleLine from 'ol/control/ScaleLine.js';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private layersListService : LayersListService) {}

  map = new Map({
    view: new View({
      center: fromLonLat([-0.363269, 43.319188]),
      zoom: 5,
    }),
    layers: this.layersListService.LayersList,
    controls: [
      new Zoom({
        className: "zoom-buttons"
      }),
    ]
  });

}
