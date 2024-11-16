import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      url: [''],
    });
  }

  onSubmit() {
    const urlValue = this.form.value.url;
    if (urlValue && urlValue.trim() !== '') {
      this.router.navigate(['/signup'], { queryParams: { url: urlValue } });
    } else {
      this.router.navigate(['/signup']);
    }
  }
}
