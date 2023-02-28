import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Zoom from 'ol/control/Zoom.js';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss']
})
export class CarteComponent implements OnInit {

  map! : Map;

  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: fromLonLat([-0.363269,43.319188]),
        zoom: 20,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      controls: [
        new Zoom({
          className:"zoom-buttons"
        })
      ]
    });
  }
}
