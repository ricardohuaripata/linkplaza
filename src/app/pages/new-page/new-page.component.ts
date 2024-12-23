import { NgClass } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { PageService } from '../../services/page/page.service';
import {
  characterPatternValidator,
  noDotAtEdgesValidator,
} from '../../validators/url-validators';

@Component({
  selector: 'app-new-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.scss',
})
export class NewPageComponent implements OnDestroy {
  newPageForm: FormGroup;
  feedbackMessage?: string;
  disableForm: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private pageService: PageService,
    private router: Router
  ) {
    this.newPageForm = this.fb.group({
      url: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(64),
          characterPatternValidator,
          noDotAtEdgesValidator,
        ],
      ],
    });
  }

  onSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      url: this.newPageForm.value.url,
    };

    this.subscription.add(
      this.pageService.createPage(requestBody).subscribe({
        next: (response: any) => {
          this.router.navigate(['/admin']);
        },
        error: (event) => {
          this.feedbackMessage = event.error.message;
          this.disableForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
