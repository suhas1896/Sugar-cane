import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldDetailsComponent } from './field-details.component';

describe('FieldDetailsComponent', () => {
  let component: FieldDetailsComponent;
  let fixture: ComponentFixture<FieldDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
