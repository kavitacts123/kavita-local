import { Component, OnInit } from '@angular/core';
import { WebPages } from '../../../../services/webpages.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessagePopupComponent } from '../../message-popup/message-popup.component';
import { Router } from '@angular/router';
import { AddPageComponent } from './add-page/add-page.component';
import { SharedService } from '../../../../services/shared.service';
interface WebPage {
  id: string;
  user_id: string;
  title: string;
  content: string;
  featured_image: string | null;
  language: string;
  status: string;
  updated_at: string;
  created_at: string;
  slug: string;
  ad_types: string;
  featured_image_path: string | null;
}
@Component({
  selector: 'app-web-pages',
  templateUrl: './web-pages.component.html',
  styleUrl: './web-pages.component.scss',
  providers: [DatePipe]
})

export class WebPagesComponent {
  allPages : WebPage[] =  [];
  idsToProceed: any = [];
  allSelected: boolean = false;
  selectedIds:any = [];
  getPageDetail:any = [];
  pages:any = [];
  lang_id: any = localStorage.getItem('lang_id');

  constructor(private sharedservice:SharedService, private webpages: WebPages, private datePipe: DatePipe, public dialog: MatDialog, private router: Router) {}
  ngOnInit(){
    this.getAllPagesData();
    this.getFrontendPages();
    this.sharedservice.data$.subscribe((data) => {
        if(data.action == 'lang_updated'){
            this.lang_id = data.id;
            this.getAllPagesData();
        }
    });
    //this.sharedservice.data$
    //lang_updated
  }

  getAllPagesData(){
    this.webpages.getAllPages(this.lang_id).subscribe((response) => {
      if(response.status){
        this.allPages = response.data.pages.map((page: any) => ({
          ...page,
          created_at: this.formatDate(page.created_at),
          updated_at: this.formatDate(page.updated_at),
        }));
      }
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || date;
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'draft':
        return 'bg_draft';
      default:
        return 'bg_success';
    }
  }

  getPublishOrDraftFilterData(type:string){
    this.allPages = [];
    this.webpages.getAllPages(this.lang_id).subscribe((response) => {
      if(response.status){
        this.allPages = response.data.pages.filter((page: any) => {
            if(page.status == type){
              return page;
            }
        });
      }
    });
  }

  confirmSingleDeletion(id:any){
    this.idsToProceed = [id];
    this.showMatDialog("", "delete-advertisement-confirmation");
  }


  showMatDialog(message:string, action:string){
    const messageDialog = this.dialog.open(MessagePopupComponent,{
      width: '500px',
      position: {
        top:'150px'
      },
      data: {
        message: message,
        action: action
      }
    })

    messageDialog.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if(result.action == "delete-confirmed"){
          this.deletePage();
        }
      }
    });
  }

  deletePage():any {
    let params = {id:this.idsToProceed};
    this.webpages.deleteWebPages(params).subscribe((response) => {
      if(response.status){
        this.getAllPagesData();
        this.showMatDialog('Page deleted successfully!.', 'display');
      }else{
        this.showMatDialog('Error in removing advertisement. Please try again.', 'display');
      }
    });
  }

  selectAllCoupons() {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.selectedIds = this.allPages.map((ad:any) => ad.id);
    } else {
      this.selectedIds = [];
    }
    console.log('Selected user IDs:', this.selectedIds);
  }

  onCheckboxChange(item: any) {
    const index = this.selectedIds.indexOf(item.id);
    if (index === -1) {
      this.selectedIds.push(item.id);
    } else {
      this.selectedIds.splice(index, 1);
    }
  }

  createNewPage(){
    const addNewPage = this.dialog.open(AddPageComponent,{
      width: '80vw',
      height: '80vh'

    })
    addNewPage.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if(result.action == "page-added-successfully"){
          this.showMatDialog('Page added successfully!.', 'display');
          this.getAllPagesData();
        }
      }
    });
  }

  viewPage(pageId: string){
    this.webpages.getSinglePageDetail(pageId).subscribe((res) => {
      if(res.status){
        const viewPage = this.dialog.open(AddPageComponent, {
          width: '2500px',
          height: '600px',
          data: {
            page: res.data.page,
          }
        })
      }      
    });
  }

  editPage(page: any){
    const addNewPage = this.dialog.open(AddPageComponent,{
      panelClass: 'full-width-dialog',
      width: '90vw',
      height: '90vh',
      data : page
    })
    addNewPage.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if(result.action == "page-added-successfully"){
          this.showMatDialog('Page updated successfully!.', 'display');
          this.getAllPagesData();
        }
      }
    });
  }

  getFrontendPages(){
    this.webpages.getFrontendPages(this.lang_id).subscribe((response) => {
      if (response.status) {
        this.pages = response.data.pages;
      }
    });
  }

}
