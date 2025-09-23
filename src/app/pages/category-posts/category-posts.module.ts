import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { CategoryPostsPageRoutingModule } from './category-posts-routing.module';

import { CategoryPostsPage } from './category-posts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPostsPageRoutingModule,
  
  ],
  declarations: [CategoryPostsPage]
})
export class CategoryPostsPageModule {}
