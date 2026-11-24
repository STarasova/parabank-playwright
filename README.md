# ParaBank Test Automation

UI, API and integration tests for [ParaBank](https://parabank.parasoft.com/parabank/index.htm) — a public demo online bank by Parasoft — written with **Playwright (JavaScript)** and **Postman / Newman**.

The project covers the core banking flows (registration, login, accounts, transfers, bill payment), checks business logic such as balances and transaction history rather than just UI messages, and links the UI and the REST API in integration tests. Along the way it found and documented several defects in ParaBank itself — see [Bugs found](#bugs-found).

## Tech stack

- [Playwright](https://playwright.dev/) with JavaScript — UI and integration tests
- Page Object Model and custom Playwright fixtures
- [Postman](https://www.postman.com/) collection — API tests
- [Newman](https://github.com/postmanlabs/newman) — runs the Postman collection from the command line
- GitHub Actions — CI
- Prettier — code formatting

## Test coverage

### Playwright: 28 tests

| Area | IDs | What is checked |
| --- | --- | --- |
| Registration | REG-01 – REG-04 | Successful registration, required fields, password confirmation, duplicate username |
| Login | AUTH-01 – AUTH-04 | Valid login, wrong password, empty fields, no access to account pages after logout |
| Accounts | ACC-01 – ACC-04 | Initial account, opening checking and savings accounts, opening deposit moves money and keeps the total |
| Transfers | TRF-01 – TRF-08 | Balances change by the transfer amount, transfer appears in both histories, validation of empty, non-numeric, zero, negative, overdraft and same-account transfers |
| Bill payment | BILL-01 – BILL-04 | Payment reduces the balance, account number mismatch, required fields, non-numeric amount |
| Integration (API + UI) | INT-01 – INT-04 | Account opened via API is shown in the UI, transfer via UI is visible via API, transfer via API appears in the UI history, balances in the UI match the API |

Negative tests check both the error **and** its consequences — for example, that balances did not change after a rejected transfer.

### Postman: API collection

| Folder | What is checked |
| --- | --- |
| Login | Login returns the customer; customer id is saved for the next requests |
| Accounts | Customer accounts are returned with a positive balance |
| Transfer | Chained scenario: open a second account, read balances, transfer, verify both balances changed by the amount |
| Negative | Wrong password is rejected; an unknown account returns a client error |
| Known bugs | A negative transfer amount must be rejected (currently fails, see below) |

## Bugs found

ParaBank is a shared public demo, and some defects were intermittent. Dates are given where behaviour changed between runs.

### 1. UI login accepts invalid credentials — critical

- **Steps:** open the login form, enter an existing username with a wrong password (or a non-existent username).
- **Expected:** login is rejected with an error message.
- **Actual:** the user is logged in and sees Accounts Overview.
- **Notes:** intermittent. On 5 Nov 2026 a wrong password was accepted; on 24 Nov 2026 any username and password were accepted. On other days the login worked correctly. At the same time the REST API correctly rejected wrong credentials (`400 Invalid username and/or password`), so the UI and the API validate credentials differently.
- **Test:** AUTH-02 fails while the defect is present.

### 2. Transfers with invalid amounts are accepted

- **Steps:** Transfer Funds → enter the amount → Transfer.
- **Expected:** the transfer is rejected and balances do not change.
- **Actual:** the following transfers are completed:
  - zero amount (TRF-05);
  - negative amount (TRF-08) — money effectively moves in the opposite direction. Also reproduced via the API: `POST transfer` with `amount=-50` returns `200`, so the problem is on the server side, not only in the form;
  - amount bigger than the balance (TRF-06) — the account goes negative;
  - transfer to the same account (TRF-07).
- **Tests:** marked with `test.fail()` as known bugs (see [Design decisions](#design-decisions)).

### 3. Empty or non-numeric transfer amount causes a server error

- **Steps:** Transfer Funds → leave the amount empty or enter `abc` → Transfer.
- **Expected:** a clear validation message, e.g. "Please enter an amount".
- **Actual:** "Error! An internal error has occurred and has been logged." No money is moved, but the message points to a server failure instead of input validation.
- **Tests:** TRF-03 and TRF-04 check that the transfer is rejected and balances are unchanged, without asserting this message, so they will keep passing when proper validation is added.

### 4. Bill payment reports success but does not reduce the balance

- **Steps:** Bill Pay → fill in all fields → Send Payment → open Accounts Overview.
- **Expected:** the balance is reduced by the payment amount.
- **Actual:** the success message is shown, but the balance is unchanged.
- **Notes:** observed on 24 Nov 2026; on earlier days the balance was reduced correctly.
- **Test:** BILL-01.

### Possible cause of intermittent behaviour

ParaBank has a public Admin Page where any visitor can change how the bank works, and the database is periodically reset. This may explain why some defects appear and disappear, but it has not been verified.

## API observations

- **`400` is returned for every error.** For example, `GET accounts/{id}` for a non-existent account returns `400 Bad Request` instead of the conventional `404 Not Found`. The API documentation does not specify status codes, so this is reported as an improvement suggestion rather than a bug. The Postman test checks the error class (`4xx`) instead of an exact code.
- **Registration is not available via the API**, so test customers are created through the UI.

## Design decisions

- **Every Playwright test creates its own customer.** The demo database is shared and periodically reset, so tests never rely on pre-existing data and can run in any order.
- **Fixtures instead of `beforeEach`.** Page objects and preconditions (`registeredCustomer`, `loggedInCustomer`, `customerWithTwoAccounts`, `api`) are provided as custom fixtures. A test requests only what it needs, and a precondition is created only when requested.
- **Business logic over messages.** Transfer and payment tests compare balances before and after the action instead of only checking "Transfer Complete!".
- **Known bugs are marked with `test.fail()`, not skipped.** The test describes the correct behaviour and is expected to fail. When the bug is fixed, the test starts passing and Playwright reports it, so the fix is noticed. `test.skip()` would hide that.
- **Tests do not lock in wrong behaviour.** Where the site shows a server error instead of a validation message, tests check that the action was rejected and nothing changed, not the exact text of the server error.
- **Money is compared as numbers.** Amounts are parsed from text (`$1,000.00` → `1000`) and compared with `toBeCloseTo(…, 2)` to avoid floating-point issues.
- **Postman for API tests, Playwright for integration tests.** Postman is the standard tool for exploring and testing an API; Playwright can drive both the browser and HTTP requests, so it is used where the UI and the API meet.
- **Preconditions via the API.** Integration tests prepare data through the API where possible — it is faster and more stable than going through the UI.

## Project structure

```
api/            API client used in integration tests
fixtures/       custom Playwright fixtures
pages/          page objects
postman/        Postman collection and environment
tests/          Playwright tests, one file per feature
utils/          test data builders and helpers
.github/        GitHub Actions workflow
```

## How to run

### Prerequisites

- [Node.js](https://nodejs.org/) LTS
- Git

### Setup

```bash
git clone https://github.com/STarasova/parabank-playwright.git
cd parabank-playwright
npm ci
npx playwright install chromium
```

### Playwright tests

```bash
npm test                              # all tests
npx playwright test tests/login.spec.js   # one file
npx playwright test -g "TRF-01"       # one test by name
npx playwright test --ui              # interactive UI mode
npx playwright show-report            # open the last HTML report
```

### API tests with Newman

The collection uses one pre-registered customer, because ParaBank has no registration API.

1. Register a customer manually on the [ParaBank registration page](https://parabank.parasoft.com/parabank/register.htm). Use a unique username: the site is shared.
2. Check the credentials via the API by opening `https://parabank.parasoft.com/parabank/services/bank/login/<username>/<password>` in a browser — it should return the customer's data.
3. Run the collection, passing the credentials:

```bash
npm run test:api -- --env-var "username=<username>" --env-var "password=<password>"
```

`test:api` runs every folder except **Known bugs**, which fails by design while the bug exists.

### API tests in Postman

Import both files from the `postman/` folder, select the **ParaBank** environment, set `username` and `password` as current values, and run the collection.

## Limitations

- **Rate limiting.** ParaBank is protected by Cloudflare and temporarily blocks clients that send too many requests (Error 1015 — *You are being rate limited*). Tests therefore run in a single worker. A failure with an Error 1015 page in the report is an environment problem, not a test failure.
- **Unstable environment.** The site is shared, its database is reset periodically, and its behaviour sometimes changes (see [Bugs found](#bugs-found)). In CI each failed test is retried once; tests reported as *flaky* should be reviewed, since they may reveal intermittent ParaBank defects.
- **Postman collection and a fixed customer.** The collection checks that a customer has exactly one account, so it is meant to run against a freshly registered customer. The customer must be registered again after a database reset.
- **Chromium only.** Other browsers can be enabled in `playwright.config.js`.

## Out of scope

- **Performance and load testing** — it would put load on a shared public site.
- **Security testing** (SQL injection, XSS, etc.) — attacking a public site is not acceptable. The login defect above was found during functional testing and only documented.
- **Admin Page and database reset endpoints** (`initializeDB`, `cleanDB`) — they affect all users of the site.
- **SOAP services, "Forgot login info", e-mails.**
- **Visual testing and cross-browser runs.**

## Author

Svitlana Tarasova
