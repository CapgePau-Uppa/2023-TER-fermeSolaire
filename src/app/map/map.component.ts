import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Zoom from 'ol/control/Zoom.js';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import HeatMap from 'ol/layer/Heatmap';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  map!: Map;

  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: fromLonLat([-0.363269, 43.319188]),
        zoom: 20,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new HeatMap({
          source: new VectorSource({
            format: new GeoJSON(),
            url: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-03-04T23%3A00%3A00Z+TO+2023-03-05T22%3A59%3A59Z%5D&lang=fr&rows=500&facet=nom&facet=tminsol&fields=tminsolc,coordonnees'
          })
        })
      ],
      target: 'map',
      controls: [
        new Zoom({
          className: "zoom-buttons"
        })
      ]
    });
  }
}
