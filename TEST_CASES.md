# Authentication Test Cases & Usage Guide

## Test Credentials (Mock Data)

### Admin User
- **Email:** `admin@frill.pk`
- **Password:** `admin123`
- **Expected Behavior:** Login → Redirect to `/admin`

### Customer User
- **Email:** `user@frill.pk`
- **Password:** `user1234`
- **Expected Behavior:** Login → Redirect to `/`

---

## Signup Page Test Cases

### TC-001: Valid Signup Flow
**Objective:** Create a new user account with valid data
**Steps:**
1. Navigate to `/signup`
2. Enter:
   - First Name: `Hassan`
   - Last Name: `Ahmed`
   - Email: `hassan@example.com`
   - Phone: `03001234567`
   - Password: `SecurePass@123`
   - Confirm Password: `SecurePass@123`
3. Check "I agree to terms"
4. Click "Create Account"

**Expected Result:** 
- User is created in mock database
- Redirected to home page `/`
- Token stored in localStorage
- User info displayed in header

---

### TC-002: Validation - Empty Fields
**Objective:** Verify form validation for empty fields
**Steps:**
1. Navigate to `/signup`
2. Try submitting without entering any data

**Expected Result:**
- Form shows error messages:
  - "First name must be at least 2 characters"
  - "Last name must be at least 2 characters"
  - "Enter a valid email address"
  - "Enter a valid Pakistani phone number"
  - "Password must be at least 8 characters"

---

### TC-003: Validation - Short First/Last Name
**Objective:** Verify minimum length validation for names
**Steps:**
1. Navigate to `/signup`
2. Enter First Name: `A` (single character)
3. Enter Last Name: `B`
4. Tab to next field

**Expected Result:**
- Error message: "First name must be at least 2 characters"
- Form cannot be submitted

---

### TC-004: Validation - Invalid Email
**Objective:** Verify email format validation
**Steps:**
1. Navigate to `/signup`
2. Enter Email: `invalid-email` (without @domain)
3. Tab to next field

**Expected Result:**
- Error message: "Enter a valid email address"

---

### TC-005: Validation - Invalid Pakistani Phone
**Objective:** Verify Pakistani phone number format
**Steps:**
1. Navigate to `/signup`
2. Enter Phone: `1234567890` (wrong format)
3. Tab to next field

**Expected Result:**
- Error message: "Enter a valid Pakistani phone number (03XXXXXXXXX)"

**Valid Phone Formats to Try:**
- `03001234567` ✅
- `03009876543` ✅
- `+923001234567` ✅

---

### TC-006: Validation - Password Mismatch
**Objective:** Verify password confirmation matching
**Steps:**
1. Navigate to `/signup`
2. Enter Password: `SecurePass@123`
3. Enter Confirm Password: `DifferentPass@123`
4. Tab to next field

**Expected Result:**
- Error message: "Passwords do not match"

---

### TC-007: Validation - Short Password
**Objective:** Verify minimum password length (8 characters)
**Steps:**
1. Navigate to `/signup`
2. Enter Password: `Pass12` (6 characters)
3. Tab to next field

**Expected Result:**
- Error message: "Password must be at least 8 characters"

---

### TC-008: Terms & Conditions - Must Accept
**Objective:** Verify terms acceptance is required
**Steps:**
1. Navigate to `/signup`
2. Fill all fields correctly
3. Leave "I agree to terms" unchecked
4. Click "Create Account"

**Expected Result:**
- Alert: "Please accept the terms and conditions"
- Form not submitted

---

### TC-009: Duplicate Email Error
**Objective:** Verify duplicate email detection
**Steps:**
1. Navigate to `/signup`
2. Enter Email: `admin@frill.pk` (existing user)
3. Fill remaining fields
4. Click "Create Account"

**Expected Result:**
- Error message: "Email already registered. Try logging in instead."
- User not created

---

### TC-010: Loading State
**Objective:** Verify loading indicator during signup
**Steps:**
1. Navigate to `/signup`
2. Fill all fields correctly
3. Click "Create Account"
4. Observe button state immediately

**Expected Result:**
- Button shows: "Creating Account..."
- Button is disabled
- After ~800ms: Redirects to home

---

### TC-011: Already Authenticated Redirect
**Objective:** Verify redirect when already logged in
**Steps:**
1. Login with valid credentials first
2. Navigate to `/signup` directly via URL
3. Observe page behavior

**Expected Result:**
- Automatically redirected to `/` (home)

---

## Login Page Test Cases

### TC-012: Valid Login - Customer
**Objective:** Login with valid customer credentials
**Steps:**
1. Navigate to `/login`
2. Enter Email: `user@frill.pk`
3. Enter Password: `user1234`
4. Click "Sign In"

**Expected Result:**
- User is authenticated
- Redirected to `/` (home page)
- Token stored in localStorage
- User info accessible in app

---

### TC-013: Valid Login - Admin
**Objective:** Login with valid admin credentials
**Steps:**
1. Navigate to `/login`
2. Enter Email: `admin@frill.pk`
3. Enter Password: `admin123`
4. Click "Sign In"

**Expected Result:**
- User is authenticated as admin
- Redirected to `/admin` (admin dashboard)
- Admin access granted

---

### TC-014: Validation - Invalid Email
**Objective:** Verify email format validation on login
**Steps:**
1. Navigate to `/login`
2. Enter Email: `not-an-email`
3. Enter Password: `password123`
4. Try submitting

**Expected Result:**
- Error message: "Enter a valid email"
- Form cannot be submitted

---

### TC-015: Validation - Short Password
**Objective:** Verify minimum password length on login
**Steps:**
1. Navigate to `/login`
2. Enter Email: `user@example.com`
3. Enter Password: `pass`
4. Try submitting

**Expected Result:**
- Error message: "Password must be at least 6 characters"
- Form cannot be submitted

---

### TC-016: Invalid Credentials
**Objective:** Verify error for incorrect credentials
**Steps:**
1. Navigate to `/login`
2. Enter Email: `user@example.com`
3. Enter Password: `wrongpassword`
4. Click "Sign In"

**Expected Result:**
- Error message: "Invalid email or password. Try admin@frill.pk / admin123"
- User not authenticated
- Remains on login page

---

### TC-017: Non-existent Email
**Objective:** Verify error for non-existent user email
**Steps:**
1. Navigate to `/login`
2. Enter Email: `nonexistent@example.com`
3. Enter Password: `somepassword`
4. Click "Sign In"

**Expected Result:**
- Error message: "Invalid email or password..."
- User not authenticated

---

### TC-018: Case Sensitivity
**Objective:** Verify email matching is case-insensitive (if applicable)
**Steps:**
1. Navigate to `/login`
2. Try with different case variations: `ADMIN@frill.pk` or `Admin@Frill.pk`
3. Enter correct password
4. Attempt login

**Expected Result:**
- Should login successfully (or show appropriate error)
- Check API behavior

---

### TC-019: Forgot Password Link
**Objective:** Verify forgot password link is accessible
**Steps:**
1. Navigate to `/login`
2. Click "Forgot password?" link

**Expected Result:**
- Navigate to `/forgot-password` page
- (Future implementation)

---

### TC-020: Already Authenticated Redirect
**Objective:** Verify redirect when already logged in
**Steps:**
1. Login successfully first
2. Navigate to `/login` directly via URL

**Expected Result:**
- Automatically redirected to `/` (home)

---

## Data Persistence Tests

### TC-021: Token Persistence
**Objective:** Verify token is saved to localStorage after login
**Steps:**
1. Login with valid credentials
2. Open browser DevTools (F12)
3. Go to Application → LocalStorage
4. Check `frill_token` key

**Expected Result:**
- `frill_token` contains JWT-like token
- Token persists after page refresh

---

### TC-022: User Data Persistence
**Objective:** Verify user info persists after refresh
**Steps:**
1. Login successfully
2. Refresh page (F5)
3. Check if user still logged in

**Expected Result:**
- User remains logged in
- User info restored from localStorage
- No re-login required

---

### TC-023: Logout Clears Data
**Objective:** Verify logout clears stored data
**Steps:**
1. Login successfully
2. Click logout (if available in UI)
3. Open DevTools → Application → LocalStorage

**Expected Result:**
- `frill_token` removed
- `frill_user` removed
- Redirected to login page
- Cannot access protected routes

---

## UI/UX Tests

### TC-024: Form Accessibility
**Objective:** Verify form is accessible via keyboard
**Steps:**
1. Navigate to `/signup`
2. Press Tab repeatedly to cycle through fields
3. Fill form using only keyboard
4. Press Enter or Tab+Space to submit

**Expected Result:**
- All fields are accessible
- Focus states are visible
- Form can be submitted with keyboard

---

### TC-025: Error Message Display
**Objective:** Verify error messages are clear and helpful
**Steps:**
1. Navigate to `/signup`
2. Enter invalid data in each field
3. Observe error messages

**Expected Result:**
- Error messages appear below each field
- Messages are red and clearly visible
- Messages are specific and helpful

---

### TC-026: Loading State Visual Feedback
**Objective:** Verify user sees loading feedback
**Steps:**
1. Navigate to `/signup`
2. Fill valid data
3. Click submit and observe button

**Expected Result:**
- Button text changes to "Creating Account..."
- Button becomes disabled/grayed out
- Visual feedback prevents double-submission

---

### TC-027: Responsive Design - Mobile
**Objective:** Verify forms work on mobile devices
**Steps:**
1. Open DevTools (F12)
2. Enable Device Toolbar (mobile view)
3. Try mobile screen sizes (375px, 768px)
4. Test form submission

**Expected Result:**
- Form remains usable on mobile
- Text is readable
- Touch targets are appropriately sized
- No horizontal scrolling needed

---

## Security Tests

### TC-028: Password Not Displayed in Plaintext
**Objective:** Verify password input is masked
**Steps:**
1. Navigate to `/signup` or `/login`
2. Type in password field
3. Observe input

**Expected Result:**
- Password appears as dots/asterisks
- Characters not visible on screen

---

### TC-029: Password Not Sent to Client in Response
**Objective:** Verify backend never returns password
**Steps:**
1. Signup/Login successfully
2. Open DevTools → Network tab
3. Check response of auth API call
4. Search for password field

**Expected Result:**
- Response never includes `password` field
- Only user info and token returned

---

### TC-030: CSRF Token (If Applicable)
**Objective:** Verify CSRF protection (if using cookies)
**Steps:**
1. Check API requests in Network tab
2. Look for CSRF token headers/body

**Expected Result:**
- CSRF tokens included where needed
- API secured against cross-site attacks

---

## Integration Tests

### TC-031: Signup → Login Flow
**Objective:** Create user via signup, then login with new account
**Steps:**
1. Navigate to `/signup`
2. Create new account with unique email
3. Fill all required fields correctly
4. Sign up successfully
5. Should redirect to home
6. Logout
7. Navigate to `/login`
8. Login with just-created email and password

**Expected Result:**
- New user can be created
- New user credentials work for login
- Full cycle works seamlessly

---

### TC-032: Authentication State in Redux
**Objective:** Verify Redux state updates correctly
**Steps:**
1. Install Redux DevTools extension
2. Open DevTools and go to Redux tab
3. Perform login
4. Check Redux state

**Expected Result:**
- `auth.token` is populated
- `auth.user` contains user data
- `auth.status` shows 'succeeded'
- `auth.error` is null

---

## Performance Tests

### TC-033: Form Validation Debouncing
**Objective:** Verify form doesn't lag during input
**Steps:**
1. Navigate to `/signup`
2. Rapidly type in email field
3. Observe responsiveness

**Expected Result:**
- Form remains responsive
- No lag or freezing
- Validation happens smoothly

---

### TC-034: API Response Time
**Objective:** Verify signup/login completes in reasonable time
**Steps:**
1. Open DevTools → Network tab
2. Perform signup/login
3. Check response time

**Expected Result:**
- Signup completes in < 1 second
- Login completes in < 500ms
- Mock has simulated delays for realism

---

## Edge Cases

### TC-035: Special Characters in Name
**Objective:** Test names with special characters
**Steps:**
1. Navigate to `/signup`
2. First Name: `O'Connor`
3. Last Name: `García-López`
4. Complete signup

**Expected Result:**
- Accept special characters
- Store and display correctly

---

### TC-036: Very Long Input
**Objective:** Test handling of very long strings
**Steps:**
1. Navigate to `/signup`
2. Enter extremely long email or name
3. Try to submit

**Expected Result:**
- Validation catches or truncates appropriately
- No crashes or errors
- UI remains functional

---

### TC-037: Rapid Form Submissions
**Objective:** Prevent double-submission
**Steps:**
1. Navigate to `/signup`
2. Fill valid form
3. Click submit multiple times rapidly

**Expected Result:**
- Only one submission processed
- Button disabled after first click
- No duplicate users created

---

## Summary of Common Issues to Check

✅ All form fields validate correctly
✅ Error messages are clear and helpful
✅ Loading states show during API calls
✅ Tokens and user data persist in localStorage
✅ Redirect after successful auth works
✅ Already-authenticated users can't access login/signup
✅ Admin users redirected to admin panel
✅ Customer users redirected to home
✅ Form is mobile-responsive
✅ Keyboard navigation works
✅ Password is masked
✅ No password in API responses

---

## Automated Testing Commands

To run unit tests (when implemented):
```bash
npm test -- auth.test.js
npm test -- --coverage
```

To test manually:
```bash
npm run dev
# Navigate to http://localhost:5173/login
# Navigate to http://localhost:5173/signup
```