import {
  browser,
  by,
  element,
  ElementArrayFinder,
  ElementFinder,
  ExpectedConditions,
  Key,
  WebDriver
} from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class AppPage {

  constructor() {
    browser.driver.manage().window().maximize();
  }

  waitFor(t: number) {
    return browser.sleep(t);
    // Might need to enable this if Webdriver gets disconnected from DOM
    // browser.waitForAngularEnabled(false);
  }

  waitForAngularEnabled(enabled: boolean) {
    return browser.waitForAngularEnabled(enabled);
  }

  waitForText(selector: string, text: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.textToBePresentInElement(e, text), 5000);
  }

  waitForAnimations() {
    return browser.sleep(3000);
    // Might need to enable this if Webdriver gets disconnected from DOM
    // browser.waitForAngularEnabled(false);
  }

  waitForStale(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.stalenessOf(e), 5000);
  }

  waitForClickable(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.elementToBeClickable(e), 5000);
  }

  waitForNotVisible(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.invisibilityOf(e), 5000);
  }

  waitForVisible(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.visibilityOf(e), 5000);
  }

  getLocalStorageVar(name: string) {
    return browser.executeScript(`return window.localStorage.getItem('${name}');`);
  }

  getSessionStorageVar(key: string) {
    return browser.executeScript(`return window.sessionStorage.getItem('${key}');`);
  }

  async clickLinkTo(route: string) {
    const selector = `[href="#${route}"]`;
    this.waitForClickable(selector);
    this.clickElement(selector);
    const actualRoute = await this.getRoute();
    expect(actualRoute).toEqual(route);
  }

  getParagraphText() {
    return this.getElement('app-root h1').getText();
  }

  clickElement(selector: string) {
    this.waitForClickable(selector);
    return this.getElement(selector).click();
  }

  clickDropdownItem(label: string, nthItem: number) {
    const dropdownSelector = `[aria-label="${label}"]`;
    const optionSelector = `mat-option:nth-of-type(${nthItem})`;
    this.waitForVisible(dropdownSelector);
    this.clickElement(dropdownSelector);
    this.waitForVisible(optionSelector);
    this.clickElement(optionSelector);
    this.waitForNotVisible(optionSelector);
  }

  isVisible(selector: string) {
    return this.getElement(selector).isDisplayed();
  }

  getElement(selector: string): ElementFinder {
    return element.all(by.css(selector)).first();
  }

  getElements(selector: string): ElementArrayFinder {
    return element.all(by.css(selector));
  }

  getChildElement(selector: string, parentElement: ElementFinder) {
    return parentElement.element(by.css(selector));
  }

  getChildElements(selector: string, parentElement: ElementArrayFinder) {
    return parentElement.all(by.css(selector));
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  async getRoute() {
    const url = await this.getUrl();
    return url.split('#')[1];
  }

  pressKey(keyCode: string) {
    browser.actions().sendKeys(protractor.Key[keyCode]).perform();
  }

  focus(selector: string) {
    browser.controlFlow().execute(() => {
      browser.executeScript('arguments[0].focus()', this.getElement(selector).getWebElement());
    });
  }

  inputText(selector: string, textToEnter: string, clearFirst?: boolean) {
    expect(this.getElements(selector).count()).toEqual(1);
    const field = this.getElement(selector);

    if (clearFirst) {
      field.clear();
      expect(field.getAttribute('value')).toEqual('');
    }

    field.sendKeys(textToEnter);
    expect(field.getAttribute('value')).toEqual(textToEnter);
  }

  navigateToUrl(url: string) {
    return browser.get(url);
  }

  navigateToHome() {
    return browser.get('/');
  }

  refresh() {
    return browser.refresh();
  }

  clickAndExpectRoute(clickSelector: string, expectedRoute: string | RegExp) {
    this.waitForClickable(clickSelector);
    this.clickElement(clickSelector);
    if (typeof expectedRoute === 'string') {
      expect(this.getRoute()).toEqual(expectedRoute);
    } else {
      expect(this.getRoute()).toMatch(expectedRoute);
    }
  }

  getRandomString(length: number) {
    const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array(length).join().split(',').map(() => s.charAt(Math.floor(Math.random() * s.length))).join('');
  }

  getRandomNumString(length: number) {
    const s = '123456789';
    return Array(length).join().split(',').map(() => s.charAt(Math.floor(Math.random() * s.length))).join('');
  }

  getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  scrollTo(selector: string) {
    browser.controlFlow().execute(() => {
      browser.executeScript('arguments[0].scrollIntoView(false)', this.getElement(selector).getWebElement());
    });
  }

  tabThroughAllFields() {
    this.focus('formly-form');

    const selector = '' +
      'formly-field [id*="_input_"],' +
      'formly-field [id*="_datepicker_"],' +
      'formly-field [id*="_radio_"],' +
      'formly-field [id*="_checkbox_"],' +
      'formly-field [id*="_select_"]';

    this.getElements(selector).each(_ => this.pressKey('TAB'));
  }

  async fillOutInvalidFields() {
    const elements = await this.getElements('.ng-invalid');
    elements.forEach(e => {
      e.getAttribute('id').then(id => {
        if (id) {
          console.log('id:', id)
          this.scrollTo(`#${id}`);
        }

        if (/_input_email_/.test(id)) {
          const email = this.getRandomString(8) + '@whatever.com';
          e.sendKeys(email);
        } else if (/_input_phone_/.test(id)) {
          const phone = this.getRandomNumString(10);
          e.sendKeys(phone);
        } else if (/_input_zip_/.test(id)) {
          const zip = this.getRandomNumString(5);
          e.sendKeys(zip);
        } else if (/_input_/.test(id)) {
          const str = this.getRandomString(16);
          e.sendKeys(str);
        } else if (/_datepicker_/.test(id)) {
          const date = this.getRandomDate(new Date(2000, 0, 1), new Date());
          const mm = date.getMonth() + 1;
          const dd = date.getDate();
          const yyyy = date.getFullYear();
          const dateStr = `${mm}/${dd}/${yyyy}`;
          e.clear();
          e.sendKeys(dateStr);
        } else if (/_radio_/.test(id)) {
          e.$(`#${id}_0`).click();
        } else if (/_checkbox_/.test(id)) {
          e.$(`#${id}_0`).click();
        } else if (/_select_/.test(id)) {
          e.click();
          const selector = '.mat-select-panel mat-option';
          this.waitForVisible(selector);
          this.getElements(selector).first().getAttribute('id').then(optionId => {
            this.getElement(`#${optionId}`).click().then(() => {
              this.waitForNotVisible(`#${optionId}`);
              this.waitForNotVisible(selector);
            });
          });
        }
      });
    });

    const multicheckboxSelector = '.ng-invalid formly-field-mat-multicheckbox mat-checkbox:first-of-type';
    const numCheckboxes = await this.getElements(multicheckboxSelector).count();
    if (numCheckboxes > 0) {
      this.getElements(`${multicheckboxSelector} .mat-checkbox-inner-container`).each(c => {
        c.click();
      });
    }

    this.getElements('input[type="checkbox"][aria-invalid="true"]').click();
    this.getElements('input[type="text"][aria-invalid="true"]').sendKeys(this.getRandomString(8));
  }
}
