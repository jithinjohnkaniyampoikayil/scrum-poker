// src/app/app.component.ts
import { Component } from '@angular/core';
import { PokerRoomComponent } from './poker-room/poker-room.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PokerRoomComponent],
  template: '<app-poker-room></app-poker-room>',
})
export class AppComponent {
  title = 'scrum-poker-app';
}
