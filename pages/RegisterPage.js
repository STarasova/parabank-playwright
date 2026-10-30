import {expect} from '@playwright/test';

export class RegisterPage {
    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;

        this.heading = page.getByRole('heading' , { name:'Signing up is easy!'});
        this.firstNameInput = page.locator( '[id="customer.firstName"]');
        this.lastNameInput = page.locator('[id="customer.lastName"]');
    this.streetInput = page.locator('[id="customer.address.street"]');
    this.cityInput = page.locator('[id="customer.address.city"]');
    this.stateInput = page.locator('[id="customer.address.state"]');
    this.zipCodeInput = page.locator('[id="customer.address.zipCode"]');
    this.phoneInput = page.locator('[id="customer.phoneNumber"]');
    this.ssnInput = page.locator('[id="customer.ssn"]');
    this.usernameInput = page.locator('[id="customer.username"]');
    this.passwordInput = page.locator('[id="customer.password"]');
    this.confirmPasswordInput = page.locator('#repeatedPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
  }
 
  async open () {
    await this.page.goto ('register.htm');
    await expect(this.heading).toBeVisible();
  }

  async register(customer) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.streetInput.fill(customer.street);
    await this.cityInput.fill(customer.city);
    await this.stateInput.fill(customer.state);
    await this.zipCodeInput.fill(customer.zipCode);
    await this.phoneInput.fill(customer.phone);
    await this.ssnInput.fill(customer.ssn);
    await this.usernameInput.fill(customer.username);
    await this.passwordInput.fill(customer.password);
    await this.confirmPasswordInput.fill(customer.confirmPassword);
    await this.registerButton.click();
  }
}