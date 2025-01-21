import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarNumberSharp, home, settingsOutline, statsChartOutline } from 'ionicons/icons';

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
    IonTabs],
})
export class AppComponent {
  constructor() {
    addIcons({
      'home':home,
      'stats-chart-outline':statsChartOutline,
      'calendar-number-outline':calendarNumberSharp,
      'settings-outline':settingsOutline
    })
  }
}
