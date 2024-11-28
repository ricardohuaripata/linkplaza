import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';

import { User } from '../../../../interfaces/user';
import { UserService } from '../../../../services/user/user.service';
import { Page } from '../../../../interfaces/page';
import { PageService } from '../../../../services/page/page.service';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [NgClass],
  templateUrl: './admin-account.component.html',
  styleUrl: './admin-account.component.scss',
})
export class AdminAccountComponent {
  loggedUser?: User;
  targetPage?: Page;
  openPageOptionsModal?: boolean;
  selectedPage?: Page;
  disableForm: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.loggedUser$.subscribe((user) => {
        console.log(user);
        this.loggedUser = user;
      })
    );
    this.subscription.add(
      this.userService.targetPage$.subscribe((page) => {
        console.log(page);
        this.targetPage = page;
      })
    );
  }

  onOpenPageOptionsModal(page: Page) {
    this.openPageOptionsModal = true;
    this.selectedPage = page;
  }

  switchPage() {
    this.openPageOptionsModal = false;
    this.userService.setTargetPage(this.selectedPage);
  }

  deletePage() {
    this.disableForm = true;
    const pageId = this.selectedPage!.id;

    this.subscription.add(
      this.pageService.deletePage(pageId).subscribe({
        next: (response: any) => {
          this.userService.setLoggedUser(response.data);
          this.userService.setTargetPage(response.data.pages[0]);
          this.disableForm = false;
          this.openPageOptionsModal = false;
        },
        error: (event) => {},
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
