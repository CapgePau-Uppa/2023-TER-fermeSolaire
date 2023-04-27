import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay.js';
import * as olCoordinate from 'ol/coordinate';
import * as olProj from 'ol/proj';
import { LayersListService } from '../services/layers-list.service';
import { MapService } from '../services/map.service';
import { defaultLineCap } from 'ol/render/canvas';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  map!: Map;
  overlay!: Overlay;
  htmlOverlay!: HTMLElement;
  sidebar!: HTMLElement | null;
  scale!: HTMLElement | null;


  constructor(private layersListService: LayersListService, private mapService: MapService) { }


  ngOnInit(): void {
    this.scale = document.getElementById('scale');
    this.scale!.classList.toggle("hidden");
    this.htmlOverlay = document.getElementById('overlay')!;

    this.overlay = new Overlay({
      element: this.htmlOverlay!,
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

    let currZoom = this.map.getView().getZoom();

    this.map.on('moveend', (event) => {
      let newZoom = this.map.getView().getZoom();
      if (currZoom != newZoom && newZoom != undefined) {
        console.log(currZoom + ' -> ' + newZoom);
        this.layersListService.updateRadius(this.selectRadiusSize(newZoom))
        currZoom = newZoom;
      }
    })
  }

  selectRadiusSize(zoom: number): number {
    if(zoom > 7) return(Math.pow(2,zoom- 5.86));
    else {
      if (zoom <= 5.5) 
      {
        return(Math.pow(2,zoom-4.7));
      }
      if (zoom <= 6.5) 
      {
        return(Math.pow(2,zoom-5));
      }
      if(zoom <= 7){
        return(Math.pow(2,zoom-5.3))
      }
      return(Math.pow(2,zoom-4));
    }
  }
}
