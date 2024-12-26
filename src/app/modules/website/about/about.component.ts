import { Component } from '@angular/core';
import { WebPages } from '../../../services/webpages.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'] // Note the plural 'styleUrls'
})
export class AboutComponent {
  adVisible = [true, true, true, true, true, true, true]; // Array to control ad visibility
  about_banner_title:string='';
  about_banner_desc:string='';
  countries = [
    { name: 'Switzerland', url: 'https://www.socceryou.ch' },
    { name: 'Germany', url: 'https://www.socceryou.de' },
    { name: 'France', url: 'https://www.socceryou.fr' },
    { name: 'Italy', url: 'https://www.socceryou.it' },
    { name: 'Portugal', url: 'https://www.socceryou.pt' },
    { name: 'England', url: 'https://www.socceryou.co.uk' },
    { name: 'Spain', url: 'https://www.socceryou.es' },
    { name: 'Belgium', url: 'https://www.socceryou.be' },
    { name: 'Sweden', url: 'https://www.socceryou.se' },
    { name: 'Denmark', url: 'https://www.socceryou.dk' }
  ];
  about_hero_heading_txt:string='';
  country_section_title:string='';
  about_hero_btn_txt:string='';
  about_hero_btn_link:string='';
  about_banner_bg_img:string='';
  about_banner_img:string='';
  country_section_banner_img:string='';

  constructor(
    private webPages: WebPages,
    ) { }
    ngOnInit(): void {
      // Initialize form with validation rules
      this.webPages.languageId$.subscribe((data) => {
        this.getPageData(data)
      });
    }

    
  getPageData(languageId: any){
    this.webPages.getDynamicContentPage('about_us',languageId).subscribe((res) => {
      if(res.status){
          this.about_banner_title = res.data.pageData.about_banner_title;
          this.about_banner_desc = res.data.pageData.about_banner_desc;
          this.countries = res.data.pageData.about_country_names;
          this.country_section_title = res.data.pageData.country_section_title;
          this.about_hero_heading_txt = res.data.pageData.about_hero_heading_txt;
          this.about_hero_btn_txt = res.data.pageData.about_hero_btn_txt;
          this.about_hero_btn_link = res.data.pageData.about_hero_btn_link;
          this.about_banner_bg_img = res.data.base_url+res.data.pageData.about_banner_bg_img;
          this.about_banner_img =  res.data.base_url+res.data.pageData.country_section_banner_img;
          this.country_section_banner_img=  res.data.base_url+res.data.pageData.country_section_banner_img;
         
        }
    });
  }
 

  closeAd(index: number) {
    this.adVisible[index] = false; // Hide the ad
  }

  openModal(modalId: string) {
    console.log(`Open modal: ${modalId}`);
    // Implement modal opening logic here
  }
}
