import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurgerManagementComponent } from './burger-management.component';

describe('BurgerManagementComponent', () => {
  let component: BurgerManagementComponent;
  let fixture: ComponentFixture<BurgerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BurgerManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BurgerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
