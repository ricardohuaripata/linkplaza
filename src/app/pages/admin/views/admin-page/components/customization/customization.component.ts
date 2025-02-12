import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

import { Page } from '../../../../../../interfaces/page';
import { PageService } from '../../../../../../services/page/page.service';
import { UserService } from '../../../../../../services/user/user.service';
import { LoadingComponent } from "../../../../../../shared/loading/loading.component";

@Component({
  selector: 'app-customization',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LoadingComponent],
  templateUrl: './customization.component.html',
  styleUrl: './customization.component.scss',
})
export class CustomizationComponent implements OnInit, OnDestroy {
  @Input() page!: Page;
  disableForm: boolean = false;

  customizationForm: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(
    private pageService: PageService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.customizationForm = this.fb.group({
      backgroundColor: [''],
      fontColor: [''],
      buttonBackgroundColor: [''],
      buttonFontColor: [''],
      buttonRounded: [null],
      fontStyle: [''],
      backgroundStyle: [''],
    });
  }

  ngOnInit(): void {
    this.customizationForm.setValue({
      backgroundColor: this.page.backgroundColor,
      fontColor: this.page.fontColor,
      buttonBackgroundColor: this.page.buttonBackgroundColor,
      buttonFontColor: this.page.buttonFontColor,
      buttonRounded: this.page.buttonRounded,
      fontStyle: this.page.fontStyle,
      backgroundStyle: this.page.backgroundStyle
    });
  }

  selectButtonStyle(buttonRounded: boolean) {
    this.customizationForm.get('buttonRounded')?.setValue(buttonRounded);
  }

  selectFontStyle(fontStyle: string) {
    this.customizationForm.get('fontStyle')?.setValue(fontStyle);
  }

  selectBackgroundStyle(backgroundStyle: string) {
    this.customizationForm.get('backgroundStyle')?.setValue(backgroundStyle);
  }

  onCustomizationFormSubmit() {
    this.disableForm = true;

    const requestBody: any = {
      backgroundColor: this.customizationForm.value.backgroundColor,
      fontColor: this.customizationForm.value.fontColor,
      buttonBackgroundColor: this.customizationForm.value.buttonBackgroundColor,
      buttonFontColor: this.customizationForm.value.buttonFontColor,
      buttonRounded: this.customizationForm.value.buttonRounded,
      fontStyle: this.customizationForm.value.fontStyle,
      backgroundStyle: this.customizationForm.value.backgroundStyle,
    };

    this.subscription.add(
      this.pageService.updatePage(this.page.id, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
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
