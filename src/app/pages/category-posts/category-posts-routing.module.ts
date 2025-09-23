import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryPostsPage } from './category-posts.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryPostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryPostsPageRoutingModule {}
