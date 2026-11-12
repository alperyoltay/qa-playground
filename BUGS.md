# Bug reports

Bugs found while automating [saucedemo.com](https://www.saucedemo.com). The site ships these accounts broken on purpose for practice; each report is written the way I would file it on a real project. Every bug has a matching test in [`tests/ui/known-bugs.spec.ts`](tests/ui/known-bugs.spec.ts).

---

## BUG-001: All products show the same image (problem_user)

| Field | Value |
|---|---|
| Severity | Medium: wrong product information shown to buyers |
| Account | `problem_user` |
| Browsers | Chromium, Firefox |

**Steps to reproduce**
1. Log in as `problem_user` / `secret_sauce`
2. Look at the product list

**Expected:** each of the 6 products shows its own photo.
**Actual:** all 6 products show the same image (a dog).

---

## BUG-002: Sorting by price does nothing (problem_user)

| Field | Value |
|---|---|
| Severity | Medium: core browsing feature broken |
| Account | `problem_user` |

**Steps to reproduce**
1. Log in as `problem_user`
2. Choose **Price (low to high)** in the sort dropdown

**Expected:** products ordered from $7.99 up to $49.99.
**Actual:** the order does not follow price.

---

## BUG-003: Typing a last name overwrites the first name (problem_user)

| Field | Value |
|---|---|
| Severity | High: blocks checkout |
| Account | `problem_user` |

**Steps to reproduce**
1. Log in as `problem_user`, add any product, open the cart, click **Checkout**
2. Type `Alper` in **First Name**
3. Type `Tester` in **Last Name**

**Expected:** Last Name contains `Tester`.
**Actual:** Last Name stays empty and the typed characters go into the First Name field instead.

---

## BUG-004: Order cannot be finished (error_user)

| Field | Value |
|---|---|
| Severity | Critical: no purchase possible |
| Account | `error_user` |

**Steps to reproduce**
1. Log in as `error_user`, add a product, go through checkout with valid info
2. Click **Finish** on the overview page

**Expected:** "Thank you for your order!" confirmation.
**Actual:** nothing happens; the user stays on the overview page.
