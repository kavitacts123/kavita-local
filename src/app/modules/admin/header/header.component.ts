import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  //constructor(private themeService: ThemeService) {}
  constructor(private themeService: ThemeService, private authService: AuthService, private router: Router,private translateService: TranslateService) {}

  lang:string = '';

 ngOnInit() {
    this.lang = localStorage.getItem('lang') || 'en'
    this.updateThemeText();
  }

  ChangeLang(lang:any){
    const selectedLanguage = typeof lang != 'string' ? lang.target.value: lang;
    localStorage.setItem('lang', selectedLanguage);
    this.translateService.use(selectedLanguage)
  }

  logout() {
    this.authService.logout();
  }

  themeText: string = 'Light Mode'

  toggleTheme(event: Event) {
    event.preventDefault();
    this.themeService.toggleTheme();
    this.updateThemeText()
  }

  updateThemeText (){
    const isDarkMode = this.themeService.isDarkMode();
this.themeText = isDarkMode ? 'Dark Mode ' : 'Light Mode'
document.getElementById('theme-text')!.textContent =this.themeText

  }


  toggleSidebar() {
    document.body.classList.toggle('mobile-sidebar-active');
  }

  closeSidebar() {
    document.body.classList.toggle('mobile-sidebar-active');
  }
}
