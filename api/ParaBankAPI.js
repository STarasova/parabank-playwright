import { expect } from '@playwright/test';

const API = 'services/bank';
const HEADERS = { Accept: 'application/json' };

export class ParaBankApi {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.request = request;
  }

  async login(username, password) {
    const response = await this.request.get(`${API}/login/${username}/${password}`, {
      headers: HEADERS,
    });
    await expect(response).toBeOK();
    return await response.json();
  }

  async getAccounts(customerId) {
    const response = await this.request.get(`${API}/customers/${customerId}/accounts`, {
      headers: HEADERS,
    });
    await expect(response).toBeOK();
    return await response.json();
  }

  async createAccount(customerId, fromAccountId, type = 0) {
    const response = await this.request.post(`${API}/createAccount`, {
      headers: HEADERS,
      params: { customerId, newAccountType: type, fromAccountId },
    });
    await expect(response).toBeOK();
    return await response.json();
  }

  async getAccount(accountId) {
    const response = await this.request.get(`${API}/accounts/${accountId}`, {
      headers: HEADERS,
    });
    await expect(response).toBeOK();
    return await response.json();
  }

  async transfer(fromAccountId, toAccountId, amount) {
    const response = await this.request.post(`${API}/transfer`, {
      headers: HEADERS,
      params: { fromAccountId, toAccountId, amount },
    });
    await expect(response).toBeOK();
    return await response.text();
  }
}
