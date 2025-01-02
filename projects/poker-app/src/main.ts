import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SocketService } from './app/services/socket.service';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), SocketService],
}).catch((err) => console.error(err));
