import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { PageService } from '../../services/page/page.service';

@Component({
  selector: 'app-new-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
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
          this.characterPatternValidator,
          this.noDotAtEdgesValidator,
        ],
      ],
    });
  }

  characterPatternValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const url = control.value;
    const pattern = /^[a-zA-Z0-9_.]+$/;
    if (url && !pattern.test(url)) {
      return { invalidCharacterPattern: true };
    }
    return null;
  }

  noDotAtEdgesValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const url = control.value;

    if (url && (url.startsWith('.') || url.endsWith('.'))) {
      return { invalidDotAtEdges: true };
    }
    return null;
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
          console.log(response);
        },
        error: (event) => {
          this.feedbackMessage = event.error.message;
          setTimeout(() => {
            this.disableForm = false;
          }, 3000);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
