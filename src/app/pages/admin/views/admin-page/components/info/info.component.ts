import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
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

import Cropper from 'cropperjs';

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

  @ViewChild('image', { static: false })
  imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('imageContainer', { static: false })
  imageContainer!: ElementRef<HTMLDivElement>;
  selectedFile: string | null = null;
  cropper: Cropper | null = null;
  croppedImage: string | null = null;
  outputFileType: string = 'image/jpeg';

  editPageFormSubmitFeedbackMessage: string | null = null;
  invalidFileMessage: string | null = null;

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
          if (this.editPageFormSubmitFeedbackMessage) {
            this.editPageFormSubmitFeedbackMessage = null;
          }
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
        console.log('file processed', file);

        this.outputFileType = file.type;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.selectedFile = e.target.result;
        };

        reader.readAsDataURL(file);
      } else {
        this.invalidFileMessage = 'File size exceeds the maximum limit.';
      }
    } else {
      this.invalidFileMessage = 'File type not allowed.';
    }
  }

  clearFile() {
    this.invalidFileMessage = null;
    this.selectedFile = null;
    this.croppedImage = null;
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  onUploadPicture(base64Image: string) {
    this.disableUploadPictureButton = true;

    const base64String = base64Image;
    const fileName = 'cropped-image';
    const mimeType = this.outputFileType;

    const file = this.base64ToFile(base64String, fileName, mimeType);

    console.log('uploading file: ', file);

    this.subscription.add(
      this.pageService.uploadPicture(this.page.id, file).subscribe({
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

  initCropper() {
    const image = this.imageElement.nativeElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      center: true,
      autoCrop: true,
      autoCropArea: 1,
      viewMode: 2,
      restore: false,
      minCropBoxWidth: 100,
      minCropBoxHeight: 100,
    });
  }

  cropImage() {
    if (this.cropper) {
      const canvas = this.cropper.getCroppedCanvas();
      if (canvas) {
        this.croppedImage = canvas.toDataURL(this.outputFileType, 0.75);
      }
    }
  }

  resetCropper() {
    if (this.cropper) {
      console.log('resetting cropper');
      this.cropper.reset();
    }
    if (this.croppedImage) {
      console.log('resetting cropped image');
      this.croppedImage = null;
    }
  }

  base64ToFile(
    base64String: string,
    fileName: string,
    mimeType: string = ''
  ): File {
    const byteString = atob(base64String.split(',')[1]);

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], fileName, { type: mimeType });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
