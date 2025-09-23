import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryPostsPage } from './category-posts.page';

describe('CategoryPostsPage', () => {
  let component: CategoryPostsPage;
  let fixture: ComponentFixture<CategoryPostsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
