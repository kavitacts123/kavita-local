import { Component,HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../services/theme.service';
import { environment } from '../../../../environments/environment';
import { ConfirmPasswordComponent } from '../SetPassword/confirmPassword.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonDataService } from '../../../services/common-data.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any; // Declare bootstrap
declare var google: any; // Declare google
import { WebPages } from '../../../services/webpages.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('invalidCredMessage') invalidCredMessage!: ElementRef;
  @ViewChild('registerForm') registerForm!: NgForm;


  isNavbarExpanded = false;
  isDarkMode: boolean = false;
  activeIndex: number = 1; // Default active tab
  role: number = 4; // Initialize role to 4 (Player)
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  language: string = '1';
  newsletter: boolean = false;
  userDomain: string = '1';
  confirmPassword: string = '';
  privacyPolicy: boolean = false;
  loginButtonClicked: boolean = false;
  invalidCred: string = '';
  registerFormSubmitted: boolean = false;
  registerError: string = '';
  forgotPasswordEmail: string = '';
  forgotPasswordMessage: string = '';
  lang: string = '';
  token: string = '';
  tokenVerified: boolean = false;
  languages:any = environment.langs;
  selectedClub: number | null = null;
  selectedCountry: string = '';
  selectedTeam: number | null = null;
  companyName: string = '';
  verifyToken:any = null;
  verifyTime:any = null;

  //this is get by the domain
  countries: Array<{ code: string; name: string }> = [];
  clubs: Array<{ id: number; name: string }> = [];
  langs: any = environment.langs;

  allLanguage = [];
  selectedLanguageId = null;
    //clubs
    // clubs = [
    //   { id: 1, name: 'Club A' },
    //   { id: 2, name: 'Club B' },
    //   { id: 3, name: 'Club C' },
    //   { id: 4, name: 'Club D' },
    //   { id: 5, name: 'Club E' },
    // ];

    teams = [
      { id: 1, name: 'Team Alpha' },
      { id: 2, name: 'Team Bravo' },
      { id: 3, name: 'Team Charlie' },
      { id: 4, name: 'Team Delta' },
      { id: 5, name: 'Team Echo' },
    ];

    customOptions: OwlOptions = {
      loop: true,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['', ''],
      responsive: {
        0: { items: 1 },
        400: { items: 2 },
        740: { items: 3 },
        940: { items: 6 }
      },
      nav: true
    };

    constructor(
      private themeService: ThemeService,
      private authService: AuthService,
      private route: ActivatedRoute,
      private router: Router,
      private translateService: TranslateService,
      public dialog: MatDialog,
      private commonDataService: CommonDataService,
      private http: HttpClient,
      private toastr : ToastrService,
      private webpage: WebPages
    ) {}

    isScrolled = false;
    serverBusy = false;
    @HostListener('window:scroll', [])

  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Adjust the scroll value as needed
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.token = params['confirm-token'] || '';
      if (this.token) {
        this.toastr.info('Processing...', 'Please Wait!');

        this.authService.magicLogin(this.token).subscribe(
          response => {
            if (response.status && response.data) {
              const token = response.data.token;
              const userData = response.data.user;
              const userRole = userData.role;

              localStorage.setItem('authToken', token);
              localStorage.setItem('userRole', userRole);
              localStorage.setItem('userData', JSON.stringify(userData));
              this.tokenVerified = true;
              this.openModal();

            } else {
              this.tokenVerified = false;
              this.router.navigate(['/expired-link']);
            }
          },
          error => {
            console.error('Error verifying token:', error);
            this.tokenVerified = false;
            this.router.navigate(['/expired-link']);
          }
        );
      }

      this.verifyToken = params['token'];
      this.verifyTime = params['time'];

      if (this.verifyToken && this.verifyTime) {
        this.toastr.info('Processing...', 'Please Wait!');

        this.authService.verifyEmail(this.verifyToken,this.verifyTime).subscribe(
          response => {
            if (response.status) {
              this.toastr.clear();

              this.toastr.success('Email is verified. You can login now...', 'Email Verified!');

              const loginModal = new bootstrap.Modal(document.getElementById('exampleModal-login'));
              loginModal.show();

            } else {
              this.toastr.clear();

              this.router.navigate(['/expired-link']);
            }
          },
          error => {
            this.toastr.clear();

            this.router.navigate(['/expired-link']);
          }
        );
      }


    });


    this.getAllCountries();
    this.getAllClubs();
    this.lang = localStorage.getItem('lang') || 'en';
    this.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode') || 'false');
    this.applyTheme();

    // Initialize Google Sign-In if available
    if (typeof google !== 'undefined' && google.accounts) {
      this.initializeGoogleSignIn();
    }

    this.getAllLanguage();
  }

  setActive(index: number): void {
    this.activeIndex = index; // Set the active index
    this.role = index === 1 ? 4 : index === 2 ? 2 : 3; // Update role based on activeIndex
  }

  toggleNavbar() {
    this.isNavbarExpanded = !this.isNavbarExpanded;
    document.body.classList.toggle('navbar-expanded', this.isNavbarExpanded);
  }

  toggleTheme(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isDarkMode = input.checked;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme();
    this.themeService.toggleTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  ChangeLang(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedLanguage = selectElement.value;
    let selectedLanguageId : any = null;
    let getLanguageIndex = this.allLanguage.findIndex((val:any) => {
      if(val.slug == selectedLanguage){
        selectedLanguageId = val.id
        return val;
      }
    });
    this.webpage.updateData(selectedLanguageId);
    this.selectedLanguageId = selectedLanguageId;
    localStorage.setItem('lang', selectedLanguage);

    // Retrieve the selected language code from localStorage
    const selectedLanguageSlug = selectedLanguage;
    // Find the corresponding language ID from the langs array
    const selectedLanguageObj = this.languages.find(
      (lang: any) => lang.slug === selectedLanguageSlug
    );

    // Default to a specific language ID if none is found (e.g., English)
    selectedLanguageId = selectedLanguageObj ? selectedLanguageObj.id : 1;
    localStorage.setItem('lang_id', selectedLanguageId);

    this.translateService.use(selectedLanguage);

    const target = event.target as HTMLSelectElement;  // Cast target to HTMLSelectElement
    if (target) {
      this.lang = target.value;
      this.getContentForLanguage(this.lang);
    }
  }

  getContentForLanguage(lang: string): void {
    const apiUrl = `${environment.apiUrl}language/${lang}`;  // Use the API URL from the environment file
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        // Handle the API response based on the selected language
        console.log(response);
        // You can update the UI or internal state with the response data
      },
      error: (error) => {
        console.error('Error fetching language content', error);
      }
    });
  }


  login() {
    this.loginButtonClicked = true;
    if (!this.email || !this.password) {
      console.error('Please fill in all required fields.');
      return;
    }

    const selectedLanguage = localStorage.getItem('lang') || '';
    const domain = environment.targetDomain?.domain || 'ch';

    const loginData = {
      email: this.email,
      password: this.password,
      lang: selectedLanguage,
      domain: domain,
    };

    this.authService.login(loginData).subscribe(
      response => {
        if (response.status === false) {
          this.invalidCred = response.message;
          this.showInvalidCredMessage();
        } else {
          const token = response.data.token;
          const userData = response.data.user_data;
          const userRole = userData.role;
          let navigationRoute = '';
          switch (userRole) {
            case "2":
              navigationRoute = '/club/dashboard';
              break;
            case "3":
              navigationRoute = '/scout/dashboard';
              break;
            case "4":
              navigationRoute = '/talent/dashboard';
              break;
            case "1":
              navigationRoute = '/admin/dashboard';
              break;
            default:
              navigationRoute = '';
              break;
          }
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(userData));

          let modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal-login'));
          if (modal) {
            modal.hide();
          }
          this.router.navigate([navigationRoute]);
        }
      },
      error => {
        console.error('An error occurred while logging in:', error);
      }
    );
  }

  private showInvalidCredMessage() {
    if (this.invalidCredMessage) {
      this.invalidCredMessage.nativeElement.style.display = 'block';
    }
  }

  register() {
    this.serverBusy = true;
    this.registerFormSubmitted = true;

    if (!this.isFormValid()) {
      this.serverBusy = false;
      this.toastr.warning('Please fill in all required fields.', 'Validation Error');
      return;
    }

    this.toastr.info('Registration is in process...', 'Please wait', { disableTimeOut: true });

    const selectedLanguage = localStorage.getItem('lang') || '';
    const domain = environment.targetDomain?.domain || 'ch';

    // Retrieve the selected language code from localStorage
    const selectedLanguageSlug = localStorage.getItem('lang') || '';

    // Find the corresponding language ID from the langs array
    const selectedLanguageObj = this.languages.find(
      (lang: any) => lang.slug === selectedLanguageSlug
    );

    // Default to a specific language ID if none is found (e.g., English)
    const selectedLanguageId = selectedLanguageObj ? selectedLanguageObj.id : 1;
    let verification_link = window.location.origin+'/home';

    const registrationData = {
      first_name: this.firstName,
      last_name: this.lastName,
      username: this.username,
      role: this.role,
      email: this.email,
      newsletter: this.newsletter,
      user_domain: this.userDomain,
      password: this.password,
      password_confirm: this.confirmPassword,
      privacy_policy: this.privacyPolicy,
      lang: selectedLanguageId,
      domain: domain,
      club_id: this.selectedClub,
      verification_link : verification_link
    };

    this.authService.register(registrationData).subscribe(
      (response) => {
        console.log('Registration response:', response);
        if (response.status === true) {
          this.toastr.clear();

          this.serverBusy = false;
          this.toastr.success('Registration successful! Thank you.', 'Success');
          const registerModal = bootstrap.Modal.getInstance(document.getElementById('exampleModal1'));
          if (registerModal) {
            registerModal.hide();
          }

          if (registerModal) {
            registerModal.hide();
          }
          this.router.navigate(['/email-verify']);

          // const loginModal = new bootstrap.Modal(document.getElementById('exampleModal-login'));
          // loginModal.show();
        } else {
          this.toastr.clear();

          let errorMessage = '';
          if (typeof response.message === 'object') {
            Object.keys(response.message).forEach((key) => {
              errorMessage += response.message[key] + ' ';
            });
          } else {
            errorMessage = response.message;
          }
          this.toastr.error(errorMessage.trim(), 'Registration Failed');
          this.registerError = errorMessage.trim();
          this.registerFormSubmitted = false;
        }
      },
      (error) => {
        this.toastr.clear();

        console.error('Registration failed:', error);
        let errorMessage = 'An error occurred during registration. Please try again.';
        if (error && error.status === 400 && error.error && error.error.data) {
          const errorData = error.error.data;
          if (errorData.username) {
            this.registerForm.controls['username'].setErrors({ usernameExists: true });
          }
          if (errorData.email) {
            this.registerForm.controls['email'].setErrors({ emailExists: true });
          }
          errorMessage = errorData.message || errorMessage;
        }
        this.toastr.error(errorMessage, 'Registration Failed');
        this.registerError = errorMessage;
        this.registerFormSubmitted = false;
      }
    );
  }

  private handleRegistrationError(error: any) {
    console.error('Registration failed:', error);
    if (error && error.status === 400 && error.error && error.error.data) {
      const errorData = error.error.data;
      if (errorData.username) {
        this.registerForm.controls['username'].setErrors({ usernameExists: true });
      }
      if (errorData.email) {
        this.registerForm.controls['email'].setErrors({ emailExists: true });
      }
      this.registerError = errorData.message || 'An error occurred during registration.';
    } else {
      this.registerError = 'An error occurred during registration. Please try again.';
    }
    this.registerFormSubmitted = false;
  }


  isFormValid(): boolean {
    let fieldType = ['string', 'boolean'];
    return [
      this.firstName,
      this.lastName,
      this.username,
      this.email,
      this.password,
      this.confirmPassword,
      this.privacyPolicy
    ].every(field => fieldType.includes(typeof field)) &&
    this.role > 0 && // Assuming role should be a positive number
    this.language.trim() !== '' && // Ensure language is a non-empty string
    this.newsletter && // Ensure this boolean value is checked as needed
    this.userDomain.trim() !== ''; // Assuming userDomain is a string
  }

  forgotPassword() {
    if (!this.forgotPasswordEmail.trim()) {
      this.forgotPasswordMessage = 'Please provide a valid email address.';
      return;
    }

    this.authService.forgotPassword(this.forgotPasswordEmail).subscribe(
      response => {
        if (response.status) {
            this.forgotPasswordMessage = response.message;
        } else {
          this.forgotPasswordMessage = response.message;
        }
      },
      () => {
        this.forgotPasswordMessage = 'An error occurred. Please try again later.';
      }
    );
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      {
        theme: 'outline',
        size: 'large',
        prompt: 'select_account'
      }
    );
  }

  handleGoogleSignIn(response: any): void {
    const idToken = response.credential;
    if (idToken) {
      localStorage.setItem('authToken', idToken);
      let modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal-login'));
      if (modal) {
        modal.hide();
      }
      this.router.navigate(['/Admin/Dashboard']);
    } else {
      this.invalidCred = 'Failed to log in with Google';
      this.showInvalidCredMessage();
    }
  }

  openModal() {

    this.dialog.open(ConfirmPasswordComponent, { width: '500px' });
  }

  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCountry = selectElement.value;
    console.log('Selected Country:', this.selectedCountry);
    this.getClugById(this.selectedCountry);
  }

  onClubChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedClub = +selectElement.value; // Convert to number
    console.log('Selected Club ID:', this.selectedClub);
  }

  onTeamChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTeam = +selectElement.value; // Convert to number
    console.log('Selected Team ID:', this.selectedTeam);
  }
  onCompanyNameChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.companyName = inputElement.value;
    console.log('Company Name:', this.companyName);
  }

  // isNavbarExpanded = false;

  // toggleNavbar() {
  //   this.isNavbarExpanded = !this.isNavbarExpanded;
  // }

  closeNavbar() {
    this.isNavbarExpanded = false;
  }


  getAllCountries(){
    this.commonDataService.getAllCountries().subscribe((resp) => {
      this.countries = resp.data.domains.map((country: any) => ({
        code: country.country_id || '',
        name: country.location || ''
      }));
    });
  }

  getClugById(id :any ){
    if(id){
      this.commonDataService.getAllClubsbyId(id).subscribe((resp) => {
        this.clubs = resp.data.clubs.map((club: any) => ({
          id: club.id || '',
          name: club.club_name || ''
        }));
        console.log(resp, 'club-resp');
      });
    }
  }
  getAllClubs(){
    this.commonDataService.getAllClubs().subscribe((resp) => {
      this.clubs = resp.data.clubs.map((club: any) => ({
        id: club.id || '',
        name: club.club_name || ''
      }));
      console.log(resp, 'club-resp');
    });
  }


  getAllLanguage(){

    this.webpage.getAllLanguage().subscribe((response) => {
      if (response.status) {
        this.languages = response.data.languages;
        localStorage.setItem('languages', JSON.stringify(this.languages));
      }
    });
  }

}
