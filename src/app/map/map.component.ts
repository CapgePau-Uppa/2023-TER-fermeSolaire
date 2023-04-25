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

export class MapComponent implements OnInit{
  map!: Map;
  overlay!: Overlay;
  htmlOverlay! : HTMLElement;
  sidebar!: HTMLElement | null;
  scale!: HTMLElement | null;

  constructor(private layersListService : LayersListService, private mapService : MapService) {}


  ngOnInit(): void {
    this.scale = document.getElementById('scale');
    this.scale!.classList.toggle("hidden");
    this.htmlOverlay = document.getElementById('overlay')!;

    this.overlay = new Overlay({
      element:  this.htmlOverlay!,
      positioning: 'bottom-center'
    });

    this.map = this.mapService.map;
    this.map.setTarget('map');
    

    this.map.on('click', (event) => {
      let element: HTMLElement | undefined = this.overlay.getElement()
      let degres: olCoordinate.Coordinate = olProj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
      if (element != undefined) {
        this.htmlOverlay.classList.toggle('hidden');
        element.innerHTML = "<div>Coordonnées : " + olCoordinate.toStringXY(degres, 5) + "</div>" + "<div>Temperature au sol : ???</div><div>Nebulosité des nuages : ???</div>";
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
