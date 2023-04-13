import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import Layer from 'ol/layer/Layer';
import { LayersListService } from '../services/layers-list.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit,AfterViewChecked{

  @Input() layer! : Layer;
  filterText!: string;
  filterId!: string;
  checkBox!: HTMLInputElement | null;
  scale!: HTMLElement | null;
  labelMin!: HTMLElement | null;
  labelMax!: HTMLElement | null;

  constructor(private layersListService : LayersListService) {}

  ngOnInit(): void {
    this.filterText = this.layer.get('text');
    this.filterId = this.layer.get('id');
  }

  ngAfterViewChecked(): void {
    this.checkBox = document.getElementById(this.filterId) as HTMLInputElement;
    this.scale = document.getElementById('scale');
    this.labelMax = document.getElementById('scaleBarMax');
    this.labelMin = document.getElementById('scaleBarMin');
  }

  checkCheckBox () {
    if (this.checkBox != null) if (this.checkBox.checked) {
      this.layer.setVisible(true);
      this.labelMin!.innerHTML = this.layer.get('min');
      this.labelMax!.innerHTML = this.layer.get('max');
    }
    else {
      this.layersListService.LayersList.find(element => { return element.get("id") == this.filterId })?.setVisible(false);
    }
    this.scale!.classList.toggle("hidden");
  }
}
