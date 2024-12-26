import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray,Validators} from '@angular/forms';
import { WebPages } from '../../../../../services/webpages.service';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';
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
  selector: 'app-add-home-page',
  templateUrl: './add-home-page.component.html',
  styleUrl: './add-home-page.component.scss'
})
export class AddHomePageComponent {
  @Input() pageId: any;
  @Input() languages: Language[] = [];
  addHomePageForm: FormGroup;
  selectedLanguage: string = '0';
  showTabForm: boolean = false;
  filesData:  any = {
    banner_bg_img : null,
    banner_img : null,
    hero_bg_img : null,
  }
  baseUrl: string = '';
  first_btn_txt: string = '';
  sec_btn_txt: string = '';
  title: string = '';
  first_tab : { title: string; desc: string; images: File[] }[] = [
    {
      title: '',
      desc : '',
      images: []
    },
    {
      title: '',
      desc : '',
      images: []
    },
    {
      title: '',
      desc : '',
      images: []
    }
  ];

  second_tab : { title: string; desc: string; images: File[] }[] = [
    {
      title: '',
      desc : '',
      images: []
    },
    {
      title: '',
      desc : '',
      images: []
    },
    {
      title: '',
      desc : '',
      images: []
    }
  ];
  imageLoaded: boolean = false;

  bannerImagePreview: any = null;
  heroBgImagePreview: any = null;
  bannerBgImagePreview: any = null;


  constructor(private fb: FormBuilder, private webpages: WebPages, public dialogRef : MatDialogRef<AddHomePageComponent>,) {
    this.addHomePageForm = this.fb.group({
      page_id: [''],
      lang_id: [''],
      banner_bg_img: [null],
      banner_img: [null],
      banner_btn_txt: [''],
      banner_btn_link: [''],
      slider_heading: [''],
      slider_btn_txt: [''],
      slider_btn_link: [''],
      hero_bg_img: [null],
      hero_heading_txt: [''],
      hero_btn_txt: [''],
      hero_btn_link: [''],
      meta_title: [''], // New input
      meta_description: [''], // New input
      lang: localStorage.getItem('lang_id'),
    });
  }

  ngOnInit() {
     if(this.pageId){
        this.getPagebyId(this.pageId);
     }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('page_id', this.pageId);
    formData.append('lang_id', this.addHomePageForm.value.lang);
  
    // Append files
    if (this.filesData.banner_bg_img) {
      formData.append('banner_bg_img', this.filesData.banner_bg_img);
    } else {
      formData.append('banner_bg_img', 'remove_img');
    }
    
    if (this.filesData.banner_img) {
      formData.append('banner_img', this.filesData.banner_img);
    } else {
      formData.append('banner_img', 'remove_img');
    }
    
    if (this.filesData.hero_bg_img) {
      formData.append('hero_bg_img', this.filesData.hero_bg_img);
    } else {
      formData.append('hero_bg_img', 'remove_img');
    }
  
    // Append text fields
    formData.append('banner_btn_txt', this.addHomePageForm.value.banner_btn_txt);
    formData.append('banner_btn_link', this.addHomePageForm.value.banner_btn_link);
    formData.append('slider_heading', this.addHomePageForm.value.slider_heading);
    formData.append('slider_btn_txt', this.addHomePageForm.value.slider_btn_txt);
    formData.append('slider_btn_link', this.addHomePageForm.value.slider_btn_link);
    formData.append('hero_heading_txt', this.addHomePageForm.value.hero_heading_txt);
    formData.append('hero_btn_txt', this.addHomePageForm.value.hero_btn_txt);
    formData.append('hero_btn_link', this.addHomePageForm.value.hero_btn_link);
    formData.append('meta_title', this.addHomePageForm.value.meta_title);
    formData.append('meta_description', this.addHomePageForm.value.meta_description);
  
    this.webpages.addHomePage(formData).subscribe((res) => {
      this.showTabForm = true;
    });
  }
  

  onTabFormSubmit(){
    let formData = new FormData();
    formData.append('page_id', this.pageId);
    formData.append('lang_id', this.addHomePageForm.value.lang_id);
    formData.append('title', this.title);
    formData.append('first_btn_txt', this.first_btn_txt);
    formData.append('sec_btn_txt', this.sec_btn_txt);

    this.first_tab.forEach((tab, index) => {
      formData.append(`first_tab[${index}][title]`, tab.title);
      formData.append(`first_tab[${index}][desc]`, tab.desc);
      tab.images.forEach((file, fileIndex) => {
        formData.append(`first_tab[${index}][images][${fileIndex}]`, file);
      });
    });
    
    // Add second_tab data with files
    this.second_tab.forEach((tab, index) => {
      formData.append(`second_tab[${index}][title]`, tab.title);
      formData.append(`second_tab[${index}][desc]`, tab.desc);
      tab.images.forEach((file, fileIndex) => {
        formData.append(`second_tab[${index}][images][${fileIndex}]`, file);
      });
    });
    //formData.append('lang', '1');

    console.log(formData);
    this.webpages.addHomePageTabData(formData).subscribe((res) => {
       this.dialogRef.close({
       action: "page-added-successfully"
       });
    });

  }

  handleTabFilesInput(files: Event, index:number, type:string) {
    const input = files.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(input.files[0], 'tstinlksdlksdj');
      const selectedFiles = Array.from(input.files);
      console.log([input.files[0], input.files[1], input.files[2]], 'sdkjdskjsdf');
      if(type == 'first_tab'){
        this.first_tab[index].images = [...selectedFiles];
        console.log(this.first_tab, 'testing...');
      }else{
        this.second_tab[index].images = [...selectedFiles];
      }      
    }
  }

  getPagebyId(id:number){

    this.webpages.getPageById(id).subscribe(response => {
      if (response.status) {
         console.log('',response.data.pageData.tabs_data.title);
         this.addHomePageForm.patchValue({
         // banner_bg_img: response.data.pageData.banner_bg_img,
         // banner_img: response.data.pageData.banner_img,
          banner_btn_txt: response.data.pageData.banner_btn_txt,
          banner_btn_link: response.data.pageData.banner_btn_link,
          slider_heading: response.data.pageData.slider_heading,
          slider_btn_txt: response.data.pageData.slider_btn_txt,
          slider_btn_link: response.data.pageData.slider_btn_link,
         // hero_bg_img: response.data.pageData.hero_bg_img,
          hero_heading_txt: response.data.pageData.hero_heading_txt,
          hero_btn_txt: response.data.pageData.hero_btn_txt,
          hero_btn_link: response.data.pageData.hero_btn_link,

          meta_title: response.data.meta_title,
          meta_description: response.data.meta_description,
        })
        // this.addHomePageForm.value.lang_id = response.data.pageData.
     
        this.bannerImagePreview = response.data.base_url + response.data.pageData.banner_bg_img;
        this.heroBgImagePreview = response.data.base_url + response.data.pageData.banner_img;
        this.bannerBgImagePreview = response.data.base_url + response.data.pageData.hero_bg_img;

        this.filesData.banner_bg_img = response.data.pageData.banner_bg_img;
        this.filesData.banner_img = response.data.pageData.banner_img;
        this.filesData.hero_bg_img = response.data.pageData.hero_bg_img;
          
        this.first_btn_txt = response.data.pageData.tabs_data.first_btn_txt;
        this.first_tab = response.data.pageData.tabs_data.first_tab;
        this.sec_btn_txt = response.data.pageData.tabs_data.sec_btn_txt;
        this.second_tab = response.data.pageData.tabs_data.second_tab;
        this.title = response.data.pageData.tabs_data.title;
        this.baseUrl = response.data.base_url;
      }
    });
     
  }

  handleFileInput(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.filesData[fieldName] = file;
  
      // For image preview
      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === 'banner_img') {
          this.bannerImagePreview = reader.result;
        } else if (fieldName === 'banner_bg_img') {
          this.bannerBgImagePreview = reader.result;
        } else if (fieldName === 'hero_bg_img') {
          this.heroBgImagePreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  removeImage(fieldName: string): void {
    this.filesData[fieldName] = null;
    if (fieldName === 'banner_img') {
      this.bannerImagePreview = null;
    } else if (fieldName === 'banner_bg_img') {
      this.bannerBgImagePreview = null;
    } else if (fieldName === 'hero_bg_img') {
      this.heroBgImagePreview = null;
    }
  }
  
  

}