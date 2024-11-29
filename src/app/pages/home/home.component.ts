import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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
