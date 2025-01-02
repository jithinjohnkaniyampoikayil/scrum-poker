import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
  templateUrl: `story-card.component.html`,
})
export class StoryCardComponent {
  @Input() votes: { username: string; vote: number | null }[] = [];
  @Input() showVotes: boolean = false;
}
