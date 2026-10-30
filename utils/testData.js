export function createCustomer() {
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
    password: 'Test123!',
    confirmPassword: 'Test123!',
  };
}