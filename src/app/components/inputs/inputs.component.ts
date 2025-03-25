import { Component, OnInit } from '@angular/core';
import { IonItem, IonInput, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
  imports: [
    IonItem, 
    IonInput,
    IonIcon]
})
export class InputsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
