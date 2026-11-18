export function createCustomer(overrides = {}) {
  const password = overrides.password ?? 'Test123!';
  return {
    firstName: 'Anna',
    lastName: 'Tester',
    street: 'Main Street 1',
    city: 'Berlin',
    state: 'Berlin',
    zipCode: '10115',
    phone: '123456789',
    ssn: '123-45-6789',
    username: `user_${Date.now()}`,
    password,
    confirmPassword: password,
    ...overrides,
  };
}

export function createPayee(overrides = {}) {
  const account = overrides.account ?? '12345';
  return {
    payeeName: 'Alisa',
    address: 'Main Street 2',
    city: 'Tallinn',
    state: 'Harjumaa',
    zipCode: '10105',
    phone: '123123123',
    account,
    verifyAccount: account,

    ...overrides,
  };
}
