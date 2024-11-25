import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Page } from '../../../../interfaces/page';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PageService } from '../../../../services/page/page.service';

@Component({
  selector: 'app-customization',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customization.component.html',
  styleUrl: './customization.component.scss',
})
export class CustomizationComponent implements OnInit, OnDestroy {
  @Input() page!: Page;
  disableForm: boolean = false;

  customizationForm: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(private pageService: PageService, private fb: FormBuilder) {
    this.customizationForm = this.fb.group({
      backgroundColor: [''],
      fontColor: [''],
      buttonBackgroundColor: [''],
      buttonFontColor: [''],
      buttonRounded: [null]
    });
  }

  ngOnInit(): void {
    this.customizationForm.setValue({
      backgroundColor: this.page.backgroundColor,
      fontColor: this.page.fontColor,
      buttonBackgroundColor: this.page.buttonBackgroundColor,
      buttonFontColor: this.page.buttonFontColor,
      buttonRounded: this.page.buttonRounded,
    });
  }

  selectButtonStyle(buttonRounded: boolean) {
    this.customizationForm.get('buttonRounded')?.setValue(buttonRounded)

  }

  onCustomizationFormSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      backgroundColor: this.customizationForm.value.backgroundColor,
      fontColor: this.customizationForm.value.fontColor,
      buttonBackgroundColor: this.customizationForm.value.buttonBackgroundColor,
      buttonFontColor: this.customizationForm.value.buttonFontColor,
      buttonRounded: this.customizationForm.value.buttonRounded,
    };

    this.subscription.add(
      this.pageService.updatePage(this.page.id, requestBody).subscribe({
        next: (response: any) => {
          this.page = response.data;
          this.disableForm = false;
        },
        error: (event) => {
          this.disableForm = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
