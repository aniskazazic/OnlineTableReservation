import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {RouterLink} from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {AiChatComponent} from '../AiChat/ai-chat/ai-chat.component';

@NgModule({
  declarations: [
    UnauthorizedComponent,
    SidebarComponent,
    AiChatComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        MatFormField,
        MatSelect,
        MatOption,
        MatLabel,
    ],
  exports: [
    UnauthorizedComponent, // Omogućavamo ponovno korištenje UnauthorizedComponent
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarComponent,
  ]
})
export class SharedModule {
}
