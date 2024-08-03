import { Component, OnInit } from '@angular/core';
import { BurgerService } from '../../services/burger.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-burger-management',
  templateUrl: './burger-management.component.html',
  styleUrls: ['./burger-management.component.css']
})
export class BurgerManagementComponent implements OnInit {
  burgers: any[] = [];
  burgerForm: FormGroup;
  editMode = false;
  selectedBurgerId: number | null = null;

  constructor(
    private burgerService: BurgerService,
    private fb: FormBuilder
  ) {
    this.burgerForm = this.fb.group({
      nom: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit() {
    this.loadBurgers();
    console.log(this.burgers);
  }

  loadBurgers() {
    this.burgerService.getAll().subscribe(
      {
        next: (data:any) => this.burgers = data.data,
        error: error => console.error('Error loading burgers', error)
      }
    );
  }

  onSubmit() {
    if (this.burgerForm.valid) {
      if (this.editMode) {
        this.burgerService.update(this.selectedBurgerId!, this.burgerForm.value).subscribe(
          () => {
            this.loadBurgers();
            this.resetForm();
          },
          error => console.error('Error updating burger', error)
        );
      } else {
        this.burgerService.create(this.burgerForm.value).subscribe(
          () => {
            this.loadBurgers();
            this.resetForm();
          },
          error => console.error('Error creating burger', error)
        );
      }
    }
  }

  editBurger(burger: any) {
    this.editMode = true;
    this.selectedBurgerId = burger.id;
    this.burgerForm.patchValue(burger);
  }

  archiveBurger(id: number) {
    this.burgerService.archive(id).subscribe(
      () => this.loadBurgers(),
      error => console.error('Error archiving burger', error)
    );
  }

  resetForm() {
    this.burgerForm.reset();
    this.editMode = false;
    this.selectedBurgerId = null;
  }
}
