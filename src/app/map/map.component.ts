import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay.js';
import * as olCoordinate from 'ol/coordinate';
import * as olProj from 'ol/proj';
import { LayersListService } from '../services/layers-list.service';
import { MapService } from '../services/map.service';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  map!: Map;
  overlay!: Overlay;
  sidebar!: HTMLElement | null;

  constructor(private layersListService : LayersListService, private mapService : MapService) {}


  ngOnInit(): void {
    this.overlay = new Overlay({
      element: document.getElementById('overlay') as HTMLElement,
      positioning: 'bottom-center'
    });

    this.map = this.mapService.map;
    this.map.setTarget('map');
    

    this.map.on('click', (event) => {
      let element: HTMLElement | undefined = this.overlay.getElement()
      let degres: olCoordinate.Coordinate = olProj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
      if (element != undefined) {
        element.innerHTML = olCoordinate.toStringXY(degres, 4) + "<p>Temperature au sol : ???</p><p>Nebulosité des nuages : ???</p>";
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
