import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonTitle, CommonModule, FormsModule, IonRow, IonCol, IonGrid, IonButton]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
