import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: `admin.component.html`,
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  @Input() roomId!: string;
  @Output() showVotes = new EventEmitter<string>();
  @Output() hideVotes = new EventEmitter<string>();
  @Output() clearVotes = new EventEmitter<string>();
  @Output() copyRoomId = new EventEmitter<string>();
}
