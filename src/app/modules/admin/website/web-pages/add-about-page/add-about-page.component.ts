// Angular Component
import { Component, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WebPages } from '../../../../../services/webpages.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar } from 'ngx-editor';
interface Language {
  id: string;
  description: string;
  language: string;
  status: string;
  updated_at: string;
  created_at: string;
  slug: string;
}

@Component({
  selector: 'app-add-about-page',
  templateUrl: './add-about-page.component.html',
  styleUrls: ['./add-about-page.component.scss']
})
export class AddAboutPageComponent implements OnInit {
  @Input() pageId: any;
  @Input() languages: Language[] = [];
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify']
  ];
  
  about_banner_bg_img:any;
  about_banner_img:any;
  country_section_banner_img:any;

  bannerBgimageLoaded: boolean = false;
  aboutBannerImagePreview: boolean = false;
  aboutCountryBannerImagePreview: boolean = false;

  formData: any = {
    meta_title: '',
    meta_description: '',
    about_banner_title: '',
    about_banner_desc: '',
    about_banner_bg_img: null,
    about_banner_img: null,
    country_section_title: '',
    about_country_names: [],
    country_section_banner_img: null,
    about_hero_heading_txt: '',
    about_hero_btn_txt: '',
    about_hero_btn_link: '',
    page_id: '',
    lang: localStorage.getItem('lang'),
    lang_id: localStorage.getItem('lang_id'),
  };

  countries: string[] = ['Switzerland', 'France', 'Germany', 'Italy', 'Portugal'];

  constructor(private webpages: WebPages, public dialogRef: MatDialogRef<AddAboutPageComponent>) {}

  ngOnInit(): void {
    this.editor = new Editor();
    
    if(this.pageId){
      this.formData.page_id = this.pageId;
      this.getPagebyId(this.pageId);
    }
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  getPagebyId(id: number): void {
    this.webpages.getPageById(id).subscribe(response => {
      if (response.status) {
        this.formData.meta_title = response.data.meta_title;
        this.formData.meta_description = response.data.meta_description;
        this.formData.about_banner_title = response.data.pageData.about_banner_title;
        this.formData.country_section_title = response.data.pageData.country_section_title;
        this.formData.about_hero_heading_txt = response.data.pageData.about_hero_heading_txt;
        this.formData.about_hero_btn_txt = response.data.pageData.about_hero_btn_txt;
        this.formData.about_hero_btn_link = response.data.pageData.about_hero_btn_link;
        this.formData.about_banner_desc =  response.data.pageData.about_banner_desc;
        if(response.data.pageData.about_banner_bg_img !=''){
          this.about_banner_bg_img = response.data.base_url + response.data.pageData.about_banner_bg_img;
          this.bannerBgimageLoaded = true;
        }
        if(response.data.pageData.about_banner_img !=''){
          this.about_banner_img = response.data.base_url + response.data.pageData.about_banner_img;
          this.aboutBannerImagePreview = true;
        }
        if(response.data.pageData.country_section_banner_img !=''){
          this.country_section_banner_img = response.data.base_url + response.data.pageData.country_section_banner_img;
          this.aboutCountryBannerImagePreview = true;
        }

      }
    });
  }
  // Update the `removeImage` method to reset the `imageLoaded` property.
  removeImage(fieldName: string): void {
    this.formData[fieldName] = 'remove_image';
    if(fieldName == 'about_banner_bg_img'){
      this.about_banner_bg_img = null;
      this.bannerBgimageLoaded = false;
    }else if(fieldName == 'about_banner_img'){
      this.about_banner_img = null;
      this.aboutBannerImagePreview = false;
    }else if(fieldName == 'country_section_banner_img'){
      this.country_section_banner_img = null;
      this.aboutCountryBannerImagePreview = false;
    }
    //this.about_banner_bg_img = null;
    //this.bannerBgimageLoaded = false;
  }

  onFileChange(event: any, fieldName: string): void {
    this.formData[fieldName] = event.target.files[0];
  }

  submitForm(): void {
    const formData = new FormData();
    for (const key in this.formData) {
      if (Array.isArray(this.formData[key])) {
        this.formData[key].forEach((item: string, index: number) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, this.formData[key]);
      }
    }
    console.log(this.formData, 'submit-form');
    this.webpages.addAboutPage(formData).subscribe(response => {
      this.dialogRef.close({
        action: 'page-added-successfully'
      });
    });
  }
}