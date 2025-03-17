import { Component, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, settingsOutline, statsChartOutline } from 'ionicons/icons';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: 
  [IonApp, 
    IonRouterOutlet,
    IonLabel,
    IonIcon,
    IonTabButton,
    IonTabBar,
    IonTabs,
    CommonModule],
})
export class AppComponent {

  urlActual : any;

  constructor(private router : Router) {
    addIcons({
      'home':home,
      'stats-chart-outline':statsChartOutline,
      'settings-outline':settingsOutline
    })
  }

  // tenemos que subscribirnos para que cargue la url xd
  ngOnInit(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event : any ) => {
      this.urlActual = event.urlAfterRedirect || event.url;
      console.log('url después de navegación -> ' + this.urlActual);
    })
  }
}
