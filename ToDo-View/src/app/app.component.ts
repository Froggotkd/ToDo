import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewTasksComponent } from "./tasks/view-tasks/view-tasks.component";
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ToDo-View';
}
