# OZ Rent A Car - Testing Record

## Account and login tests

All account-flow tests were completed successfully during development.

| Test | Expected result | Result |
| --- | --- | --- |
| Register a new user | Account is created and user is signed in | PASS |
| Register a duplicate email | Duplicate account is rejected | PASS |
| Sign out | Session is removed from the client | PASS |
| Sign in with correct details | User account opens successfully | PASS |
| Sign in with incorrect password | Login is rejected | PASS |
| Sign in with unknown email | Login is rejected without crashing | PASS |
| Refresh while signed in | User remains signed in while the server session is active | PASS |
| Confirm booking while signed out | Authentication is required | PASS |
| Confirm booking while signed in | Booking is created successfully | PASS |
| Open My Bookings | User booking history is displayed | PASS |
| Sign in as another user | Other users' bookings are not displayed | PASS |
| Inspect stored password | Password is stored as a salted hash, not plain text | PASS |
| Submit empty account fields | Form/server validation blocks submission | PASS |
| Submit invalid email | Invalid email is rejected | PASS |
| Register with short password | Password shorter than 8 characters is rejected | PASS |

## Booking and interface checks

- Availability is calculated on the Express server from the requested date range and existing bookings.
- The quote is recalculated by the server whenever optional extras change.
- The previous quote is cleared while a new total is being calculated so stale pricing cannot be confirmed.
- Booking availability is checked again on the server before a confirmed booking is written.
- Loading, empty and error states are shown in the interface.
- Date inputs prevent an invalid return date in the browser and the server also validates the date range.
- Keyboard focus styles, modal Escape handling, semantic labels and reduced-motion support are included.
- The layout changes from one-column phone presentation to two-column tablet fleet and desktop sidebar/three-column fleet.

## Development commands

```bash
npm run lint
npm run build
```

Both commands should be run before the final GitHub submission.
