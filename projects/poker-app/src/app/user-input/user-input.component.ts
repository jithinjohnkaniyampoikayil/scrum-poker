import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: `./user-input.component.html`,
  styleUrls: ['./user-input.component.scss'],
})
export class UserInputComponent {
  @Output() userJoined = new EventEmitter<string>();
  @Input() room: string = '';
  username = '';
  joined = false;
  storyPoints = [1, 2, 3, 5, 8, 13, 21, 27];

  constructor(private socketService: SocketService) {}

  join() {
    if (this.username) {
      this.joined = true;
      this.userJoined.emit(this.username);
    }
  }

  vote(points: number) {
    this.socketService.emit('vote', { points, room: this.room });
  }
}
