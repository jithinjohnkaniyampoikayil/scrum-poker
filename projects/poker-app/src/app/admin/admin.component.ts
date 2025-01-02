import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: `admin.component.html`,
  styles: ['button { margin-right: 10px; }'],
})
export class AdminComponent {
  @Input() roomId!: string;
  @Output() showVotes = new EventEmitter<string>();
  @Output() hideVotes = new EventEmitter<string>();
  @Output() clearVotes = new EventEmitter<string>();
  @Output() copyRoomId = new EventEmitter<string>();
}
