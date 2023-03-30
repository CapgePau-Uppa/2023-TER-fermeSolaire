import { AfterViewChecked, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewChecked {
  searchword! : string;
  sidebar!: HTMLElement | null;

  ngAfterViewChecked(): void {
    this.sidebar = document.getElementById('sidebar');
  }

  button_click(): void {
    if (this.sidebar != null) this.sidebar.classList.toggle("sidebar--deployed");
    console.log(this.sidebar);
  }

  search(): void {
    let word : string = this.searchword;
    word = word.replaceAll(" ","+");
    console.log("https://nominatim.openstreetmap.org/search?q=" + word);
    console.log("https://nominatim.openstreetmap.org/search?q=" + word + "&format=geojson");
  }
}
