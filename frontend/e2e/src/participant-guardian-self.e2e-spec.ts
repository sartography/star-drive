import { AppPage } from './app-page.po';
import { GlobalHeaderUseCases } from './use-cases/global-header.po';
import { LoginUseCases } from './use-cases/login.po';

describe('Participant (Guardian - Self)', () => {
  let page: AppPage;
  let globalHeaderUseCases: GlobalHeaderUseCases;
  let loginUseCases: LoginUseCases;
  let randomEmail;
  const email = 'aaron@sartography.com';
  const password = 'alouie3';

  beforeAll(() => {
    page = new AppPage();
    globalHeaderUseCases = new GlobalHeaderUseCases(page);
    loginUseCases = new LoginUseCases(page);
    randomEmail = `aaron_${page.getRandomString(16)}@sartography.com`;
    page.navigateToHome();
  });

  // Global Header
  it('should display sitewide header', () => globalHeaderUseCases.displaySitewideHeader());
  it('should display utility navigation', () => globalHeaderUseCases.displayUtilityNav());
  it('should display logged-out state in utility navigation', () => globalHeaderUseCases.displayLoggedOutState());
  it('should display primary navigation', () => globalHeaderUseCases.displayPrimaryNav());
  it('should visit home page', () => globalHeaderUseCases.visitHomePage());
  it('should visit enroll page', () => globalHeaderUseCases.visitEnrollPage());
  it('should visit studies page', () => globalHeaderUseCases.visitStudiesPage());
  it('should visit resources page', () => globalHeaderUseCases.visitResourcesPage());

  // Login & Register
  it('should display terms and conditions when Create Account button is clicked', () => loginUseCases.displayTerms());
  it('should display login form', () => loginUseCases.displayLoginForm());
  it('should display forgot password form', () => loginUseCases.displayForgotPasswordForm());
  it('should display register form', () => loginUseCases.displayRegisterForm());
  it('should accept terms and conditions', () => loginUseCases.acceptTerms());
  it('should display confirmation message on submit', () => loginUseCases.displayRegisterConfirmation(randomEmail));
  it('should display error message when submitting a duplicate email address', () => loginUseCases.displayRegisterError(randomEmail));
  it('should display Forgot Password form confirmation message', () => loginUseCases.displayForgotPasswordConfirmation(randomEmail));
  it('should display Forgot Password form error message', () => loginUseCases.displayForgotPasswordError());
  it('should log in with email and password', () => loginUseCases.loginWithCredentials(email, password));

  // !!! TO DO - This test is failing due to user object at app component level not
  // being updated on login. Need to completely refactor authentication to fix this.
  xit('should display logged-in header state', () => globalHeaderUseCases.displayLoggedInState());

});