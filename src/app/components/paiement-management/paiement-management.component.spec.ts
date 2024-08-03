import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementManagementComponent } from './paiement-management.component';

describe('PaiementManagementComponent', () => {
  let component: PaiementManagementComponent;
  let fixture: ComponentFixture<PaiementManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaiementManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
