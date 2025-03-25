import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, 
  IonToolbar, 
  IonContent, 
  IonTitle, 
  IonRow, 
  IonCol, 
  IonGrid,
  IonButton } from '@ionic/angular/standalone';
import { InputsComponent } from 'src/app/components/inputs/inputs.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonContent, 
    IonTitle, 
    CommonModule, 
    FormsModule, 
    IonRow, 
    IonCol, 
    IonGrid, 
    IonButton,
    InputsComponent]
})
export class LoginPage implements OnInit {
  @ViewChild(InputsComponent) inputs!: InputsComponent;


  constructor() { }

  ngOnInit() {
  }

}
