import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { LayersListService } from '../services/layers-list.service';
import { MapService } from '../services/map.service';
import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Polygon } from 'ol/geom';
import { Extent, boundingExtent } from 'ol/extent';
import Layer from 'ol/layer/Layer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewChecked, OnInit{
  searchword!: string;
  sidebar!: HTMLElement | null;
  scale!: HTMLElement | null;
  groundTemp!: HTMLInputElement | null;
  nebulosity!: HTMLInputElement | null;
  labelMin!: HTMLElement | null;
  labelMax!: HTMLElement | null;
  filters! : Layer[];


  constructor(private layersListService: LayersListService, private mapService: MapService) { }

  ngOnInit(): void {
    this.filters = this.layersListService.LayersList;
  }

  ngAfterViewChecked(): void {
    this.sidebar = document.getElementById('sidebar');
    this.groundTemp = document.getElementById('groundTemp') as HTMLInputElement;
    this.nebulosity = document.getElementById('nebulosity') as HTMLInputElement;
    this.scale = document.getElementById('scale');
    this.labelMax = document.getElementById('scaleBarMax');
    this.labelMin = document.getElementById('scaleBarMin');
  }

  button_click(): void {
    if (this.sidebar != null) this.sidebar.classList.toggle("sidebar--deployed");
  }

  async search(): Promise<void> {
    let result;
    let word: string = this.searchword;
    let boundingBox: number[];
    word = word.replaceAll(" ", "+");
    console.log("https://nominatim.openstreetmap.org/search?q=" + word);
    console.log("https://nominatim.openstreetmap.org/search?q=" + word + "&format=json&limit=1");
    result = await this.getSearch(word);

    boundingBox = result.boundingbox;
    this.changeViewFromSearch(result.lon, result.lat, this.computeZoom([[boundingBox[2], boundingBox[0]], [boundingBox[3], boundingBox[1]]]));
  }

  checkGroundTemp(): void {
    if (this.groundTemp != null) if (this.groundTemp.checked) {
      this.layersListService.LayersList.find(element => { return element.get("name") == "GroundTemp" })?.setVisible(true);
      this.labelMin!.innerHTML = this.layersListService.LayersList.find(element => { return element.get("name") == "GroundTemp" })?.get('min');
      this.labelMax!.innerHTML = this.layersListService.LayersList.find(element => { return element.get("name") == "GroundTemp" })?.get('max');
    }
    else {
      this.layersListService.LayersList.find(element => { return element.get("name") == "GroundTemp" })?.setVisible(false);
    }
    this.scale!.classList.toggle("hidden");
  }

  checkNebulosity(): void {
    if (this.nebulosity != null) if (this.nebulosity.checked) {
      this.layersListService.LayersList.find(element => { return element.get("name") == "Nebulosity" })?.setVisible(true);
      this.labelMin!.innerHTML = this.layersListService.LayersList.find(element => { return element.get("name") == "Nebulosity" })?.get('min');
      this.labelMax!.innerHTML = this.layersListService.LayersList.find(element => { return element.get("name") == "Nebulosity" })?.get('max');
    }
    else {
      this.layersListService.LayersList.find(element => { return element.get("name") == "Nebulosity" })?.setVisible(false);
    }
    this.scale!.classList.toggle("hidden");
  }

  async getSearch(word: string) {
    let data = await fetch("https://nominatim.openstreetmap.org/search?q=" + word + "&format=json&limit=1")
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        return data[0];
      })
    return data;
  }

  changeViewFromSearch(x: number, y: number, zoom: number): void {
    console.log(zoom);
    this.mapService.map.setView(new View({
      center: fromLonLat([x, y]),
      zoom: zoom,
    }));
  }

  computeZoom(coordinates: number[][]): number {
    const mapDiag: number = Math.sqrt(Math.pow(-180 - 180, 2) + Math.pow(-72 - 72, 2));
    let diag: number = (Math.sqrt(Math.pow(coordinates[0][0] - coordinates[1][0], 2) + Math.pow(coordinates[0][1] - coordinates[1][1], 2)));
    return (Math.round(Math.log2(mapDiag / diag)));
  }
}

