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
import Overlay from 'ol/Overlay.js';
import * as olCoordinate from 'ol/coordinate';
import * as olProj from 'ol/proj';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit/*AfterViewChecked*/ {
  map!: Map;
  overlay!: Overlay;
  sidebar!: HTMLElement | null;


  ngOnInit(): void {
    this.overlay = new Overlay({
      element: document.getElementById('overlay') as HTMLElement,
      positioning: 'bottom-center'
    });

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
            url: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=donnees-synop-essentielles-omm&q=date%3A%5B2023-03-04T23%3A00%3A00Z+TO+2023-03-05T22%3A59%3A59Z%5D&lang=fr&rows=500&facet=nom&facet=tminsol&fields=tminsolc,coordonnees&format=geojson'
            //url: 'http://localhost:3000/geojson'
          }),
          visible: true,
          blur: 20,
          radius: 5,
          weight: function (feature) {
            return ((feature.get('tminsolc') + 10) / 60);
          },
        })
      ],
      target: 'map',
      controls: [
        new Zoom({
          className: "zoom-buttons"
        })
      ]
    });

    this.map.on('click', (event) => {
      var element: HTMLElement | undefined = this.overlay.getElement()
      var degres: olCoordinate.Coordinate = olProj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
      if (element != undefined) {
        element.innerHTML = olCoordinate.toStringXY(degres, 4);
      }
      this.overlay.setPosition(event.coordinate);
      this.map.addOverlay(this.overlay);
    });

    // fetch('http://localhost:3000/geojson')
    //   .then(response => response.json())
    //   .then(data => console.log("Here is the GeoJSON fetched :", data))
    //   .catch(error => console.error(error));

  fetch('http://localhost:3000/average')
  .then(response => response.json())
  .then(data => console.log("Here is the object fetched :", data))
  .catch(error => console.error(error));

  }
}
