import { Component, inject } from '@angular/core';
import Talk from 'talkjs';
import { InboxPopupComponent } from './inbox-popup/inbox-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {
  readonly dialog = inject(MatDialog);
  userData:any;
  ngAfterViewInit(): void{
      const userDataString = localStorage.getItem('userData');
      Talk.ready.then(() => {
        if (userDataString) {
          this.userData = JSON.parse(userDataString);
          const me = new Talk.User({
            id: this.userData.id,
            name: this.userData.first_name,
            email: this.userData.username,
            photoUrl: "https://talkjs.com/new-web/avatar-7.jpg",
            welcomeMessage: "Hi!",
          });
       const session = new Talk.Session({
        appId: "tHcyGZjg",
        me: me,
      });
      const inbox = session.createInbox({
        showChatHeader: true
      });
      inbox.mount(document.getElementById("talkjs-container"));
    }
  });
  }

  editinbox() {
    console.log("svcoiufuy")
    this.dialog.open(InboxPopupComponent, {
      height: '450px',
      width: '40vw',


    })
  }
}
