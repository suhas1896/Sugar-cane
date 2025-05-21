import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factories',
  templateUrl: './factories.component.html',
  styleUrls: ['./factories.component.css'],
  standalone: true,
  imports: [TranslateModule, FormsModule, CommonModule]
})
export class FactoriesComponent implements OnInit {

  factories = [
    { id: 'factory1', nameKey: 'FACTORY.NAME1', titleKey: 'FACTORY.TITLE', capacity: 200, statusKey: 'FACTORY.SHUTDOWN', isEditing: false },
    { id: 'factory2', nameKey: 'FACTORY.NAME2', titleKey: 'FACTORY.TITLE', capacity: 150, statusKey: 'FACTORY.ACTIVE', isEditing: false },
    { id: 'factory3', nameKey: 'FACTORY.NAME3', titleKey: 'FACTORY.TITLE', capacity: 180, statusKey: 'FACTORY.ACTIVE', isEditing: false }
  ];

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadCapacitiesFromCookies();
  }

  navigateToDetails(factoryId: string, statusKey: string) {
    this.router.navigate(['/details'], { queryParams: { factory: factoryId, status: statusKey } });
  }

  enableEdit(factoryId: string) {
    const factory = this.factories.find(f => f.id === factoryId);
    if (factory) {
      factory.isEditing = true;
    }
  }

  saveCapacity(factoryId: string, newCapacity: number) {
    const factory = this.factories.find(f => f.id === factoryId);
    if (factory) {
      factory.capacity = newCapacity;
      factory.isEditing = false;
      document.cookie = `${factoryId}Capacity=${newCapacity}; path=/; max-age=31536000`;
    }
  }

  loadCapacitiesFromCookies() {
    const cookies = document.cookie.split(';');
    this.factories.forEach(factory => {
      const cookie = cookies.find(c => c.trim().startsWith(`${factory.id}Capacity=`));
      if (cookie) {
        const value = parseInt(cookie.split('=')[1], 10);
        if (!isNaN(value)) {
          factory.capacity = value;
        }
      }
    });
  }
}
