import { Component } from '@angular/core';
import { AiService } from '../../../services/ai.service'

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent {
  prompt = '';
  response = '';
  loading = false;
  show = true;

  constructor(private aiService: AiService) {}

  send() {
    if (!this.prompt.trim()) return;

    this.loading = true;
    this.aiService.ask(this.prompt).subscribe({
      next: res => {
        this.response = res.responseText;
        this.loading = false;
      },
      error: err => {
        this.response = 'Something went wrong.';
        this.loading = false;
      }
    });
  }

  close() {
    this.show = false;
  }
  clearPrompt() {
    this.prompt = '';
  }

}
