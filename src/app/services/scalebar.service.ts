import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScalebarService {

  min : number = 0;
  
  max : number = 100;

}
