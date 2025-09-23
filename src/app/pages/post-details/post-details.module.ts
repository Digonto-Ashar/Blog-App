import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDetailsPageRoutingModule } from './post-details-routing.module';

import { PostDetailsPage } from './post-details.page';

import { CommentsComponentModule } from '../../components/comments/comments.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDetailsPageRoutingModule,
    CommentsComponentModule
    
  ],
  declarations: [PostDetailsPage]
})
export class PostDetailsPageModule {}
