import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserInputComponent } from '../user-input/user-input.component';
import { StoryCardComponent } from '../story-card/story-card.component';
import { AdminComponent } from '../admin/admin.component';
import { v4 as uuidv4 } from 'uuid';
import { SocketService } from '../services/socket.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poker-room',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    UserInputComponent,
    StoryCardComponent,
    AdminComponent,
  ],
  templateUrl: './poker-room.component.html',
  styleUrls: ['./poker-room.component.scss'],
})
export class PokerRoomComponent implements OnInit {
  rooms: { id: string; isAdmin: boolean }[] = [];
  roomVotes: { [room: string]: { username: string; vote: number | null }[] } =
    {};
  currentRoom: string = '';
  showVotes: { [room: string]: boolean } = {};
  roomForm: FormGroup;
  isRoomCreated: boolean = false;
  isUserJoined: boolean = false;
  private isDialogOpen = false;
  username: string = '';

  constructor(
    private socketService: SocketService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.roomForm = this.formBuilder.group({
      roomId: [''],
    });
  }

  ngOnInit() {
    this.socketService.on('voteUpdate').subscribe((data: any) => {
      this.roomVotes[data.room] = data.votes;
    });
    this.socketService.on('showVotes').subscribe((room: string) => {
      this.showVotes[room] = true;
    });
    this.socketService.on('hideVotes').subscribe((room: string) => {
      this.showVotes[room] = false;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    if (!this.isDialogOpen && this.isRoomCreated) {
      $event.preventDefault();
      $event.returnValue = true;
    }
  }

  createNewRoom() {
    this.isRoomCreated = true;
    const newRoomId = uuidv4();
    this.rooms.push({ id: newRoomId, isAdmin: true });
    this.socketService.emit('createRoom', newRoomId);
    this.copyRoomId(newRoomId);
  }

  joinRoom() {
    this.isRoomCreated = true;
    const roomId = this.roomForm.get('roomId')?.value;
    if (roomId && !this.rooms.some((room) => room.id === roomId)) {
      this.rooms.push({ id: roomId, isAdmin: false });
      this.socketService.emit('joinRoom', roomId);
      this.roomForm.reset();
    }
  }

  copyRoomId(roomId: string) {
    navigator.clipboard.writeText(roomId).then(() => {
      this.snackBar.open('Room ID copied to clipboard', 'Close', {
        duration: 2000,
      });
    });
  }

  onUserJoined(username: string, room: string) {
    this.socketService.emit('join', { username, room });
    this.username = username;
    this.isUserJoined = true;
  }

  onRoomChange(event: any) {
    this.currentRoom = this.rooms[event.index].id;
  }

  onShowVotes(room: string) {
    this.socketService.emit('showVotes', room);
  }

  onHideVotes(room: string) {
    this.socketService.emit('hideVotes', room);
  }

  onClearVotes(room: string) {
    this.socketService.emit('clearVotes', room);
  }
}
