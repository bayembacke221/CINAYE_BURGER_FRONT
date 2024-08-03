import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeManagementComponent } from './commande-management.component';

describe('CommandeManagementComponent', () => {
  let component: CommandeManagementComponent;
  let fixture: ComponentFixture<CommandeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
