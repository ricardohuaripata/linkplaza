import { NgClass } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Page } from '../../../../../../interfaces/page';
import { PageService } from '../../../../../../services/page/page.service';
import { UserService } from '../../../../../../services/user/user.service';
import { LoadingComponent } from '../../../../../../shared/loading/loading.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, LoadingComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent implements OnInit, OnDestroy {
  @Input() page!: Page;
  disableEditPageForm: boolean = false;
  disableUploadPictureButton: boolean = false;

  openEditPageModal: boolean = false;
  openUploadPictureModal: boolean = false;

  editPageForm: FormGroup;

  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  invalidFileMessage?: string;

  editPageFormSubmitFeedbackMessage?: string;

  private subscription: Subscription = new Subscription();

  constructor(
    private pageService: PageService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.editPageForm = this.fb.group({
      title: ['', Validators.maxLength(32)],
      bio: ['', Validators.maxLength(256)],
    });
  }

  ngOnInit(): void {
    this.editPageForm.setValue({
      title: this.page?.title,
      bio: this.page?.bio,
    });
  }

  onEditPageFormSubmit() {
    this.disableEditPageForm = true;

    const requestBody: any = {
      title: this.editPageForm.value.title,
      bio: this.editPageForm.value.bio,
    };

    this.subscription.add(
      this.pageService.updatePage(this.page.id, requestBody).subscribe({
        next: (response: any) => {
          this.userService.setTargetPage(response.data);
          this.disableEditPageForm = false;
          this.openEditPageModal = false;
        },
        error: (event) => {
          this.editPageFormSubmitFeedbackMessage = event.error.message;
          this.disableEditPageForm = false;
        },
      })
    );
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    const validExtensions = ['jpg', 'jpeg', 'webp', 'png'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // validar tamaño del archivo (5 MB = 5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024;

    // validar tipo de archivo
    if (fileExtension && validExtensions.includes(fileExtension)) {
      if (file.size <= maxSizeInBytes) {
        this.selectedFile = file;
        this.selectedFileUrl = URL.createObjectURL(file);
        console.log('file processed', this.selectedFile);
      } else {
        this.invalidFileMessage = 'File size exceeds the maximum limit.';
      }
    } else {
      this.invalidFileMessage = 'File type not allowed.';
    }
  }

  clearFile() {
    if (this.selectedFileUrl) {
      URL.revokeObjectURL(this.selectedFileUrl);
    }
    this.invalidFileMessage = undefined;
    this.selectedFile = null;
    this.selectedFileUrl = null;
  }

  onUploadPicture() {
    if (!this.selectedFile) {
      return;
    }

    this.disableUploadPictureButton = true;

    this.subscription.add(
      this.pageService
        .uploadPicture(this.page.id, this.selectedFile)
        .subscribe({
          next: (response: any) => {
            this.userService.setTargetPage(response.data);
            this.disableUploadPictureButton = false;
            this.openUploadPictureModal = false;
            this.clearFile();
          },
          error: (event) => {
            this.disableUploadPictureButton = false;
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
