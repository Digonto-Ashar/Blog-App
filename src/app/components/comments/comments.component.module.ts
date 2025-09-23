import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommentsComponent } from './comments.component';

@NgModule({
  imports: [ 
    CommonModule, 
    FormsModule, 
    IonicModule, 
    ReactiveFormsModule 
  ],
  declarations: [CommentsComponent],
  exports: [CommentsComponent] 
})
export class CommentsComponentModule {}
