// src/app/tabs/tabs.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  selectedTab: string;

  constructor(private router: Router) {
    // Initialize with a default value
    this.selectedTab = 'home';
  }

  // This function is called when a segment button is clicked
  navigateTo(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }

  // This function keeps the segment in sync when the user navigates
  // (e.g., using the browser's back button)
  setCurrentTab(event: any) {
    this.selectedTab = event.tab;
  }
}
