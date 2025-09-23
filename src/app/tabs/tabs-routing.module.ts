import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
          },
          // NEW: Post Details is a child of the Home tab
          {
            path: 'post/:id',
            loadChildren: () => import('../pages/post-details/post-details.module').then(m => m.PostDetailsPageModule)
          }
        ]
      },
      {
        path: 'category',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/category/category.module').then(m => m.CategoryPageModule)
          },
          // CORRECTED: The path is more descriptive now
          {
            path: 'posts/:id',
            loadChildren: () => import('../pages/category-posts/category-posts.module').then(m => m.CategoryPostsPageModule)
          },
          // NEW: Post Details is ALSO a child of the Category tab
          {
            path: 'post/:id',
            loadChildren: () => import('../pages/post-details/post-details.module').then(m => m.PostDetailsPageModule)
          }
        ]
      },
      {
        path: 'search',
        loadChildren: () => import('../pages/search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'favorite',
        loadChildren: () => import('../pages/favorite/favorite.module').then(m => m.FavoritePageModule)
      },
      
     {
        path: 'notifications', 
        loadChildren: () => import('../pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
      },

     {
        path: 'create-post',
        loadChildren: () => import('../pages/create-post/create-post.module').then(m => m.CreatePostPageModule)
      },

      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
