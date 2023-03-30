import { AfterViewChecked, Component } from '@angular/core';
import { LayersListService } from '../services/layers-list.service';
import { MapService } from '../services/map.service';
import { View } from 'ol';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewChecked {
  searchword! : string;
  sidebar!: HTMLElement | null;
  groundTemp!: HTMLInputElement | null;
  nebulosity!: HTMLInputElement | null;
  minLabel = document.getElementById("scaleBarMin");
  maxLabel = document.getElementById("scaleBarMax");

  constructor(private layersListService : LayersListService, private mapService : MapService) {}

  ngAfterViewChecked(): void {
    this.sidebar = document.getElementById('sidebar');
    this.groundTemp = document.getElementById('groundTemp')as HTMLInputElement ;
    this.nebulosity = document.getElementById('nebulosity')as HTMLInputElement ;
  }

  button_click(): void {
    if (this.sidebar != null) this.sidebar.classList.toggle("sidebar--deployed");
    console.log(this.sidebar);
  }

  async search(): Promise<void> {
    let result;
    let word : string = this.searchword;
    word = word.replaceAll(" ","+");
    console.log("https://nominatim.openstreetmap.org/search?q=" + word);
    console.log("https://nominatim.openstreetmap.org/search?q=" + word + "&format=json&limit=1");
    result = await this.getSearch(word);
    this.changeViewFromSearch(result.lon,result.lat , 15 );
  }

  checkGroundTemp() : void {
    console.log("Checking Ground Temp")
    if(this.groundTemp != null ) if (this.groundTemp.checked){
      this.layersListService.LayersList.find(element => {return element.get("name") == "GroundTemp"})?.setVisible(true);
    }
    else this.layersListService.LayersList.find(element => {return element.get("name") == "GroundTemp"})?.setVisible(false);
  }

  checkNebulosity() : void {
    if(this.nebulosity != null ) if (this.nebulosity.checked){
      this.layersListService.LayersList.find(element => {return element.get("name") == "Nebulosity"})?.setVisible(true);
    }
    else this.layersListService.LayersList.find(element => {return element.get("name") == "Nebulosity"})?.setVisible(false);
  }

  async getSearch(word : string) {
    let data = await fetch("https://nominatim.openstreetmap.org/search?q=" + word + "&format=json&limit=1")
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        return data[0];
      })
    return data;
  }

  changeViewFromSearch(x : number, y : number, zoom : number) : void {
    this.mapService.map.setView(new View({
      center: fromLonLat([x, y]),
      zoom: zoom,
    }))
  }
}
function getElementById(): string {
  throw new Error('Function not implemented.');
}

