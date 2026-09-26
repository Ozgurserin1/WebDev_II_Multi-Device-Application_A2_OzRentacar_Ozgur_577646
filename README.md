# OZ RENT A CAR

Responsive single-page car rental application built with React, Vite and Express.

## Structure

- `client` - React/Vite front end
- `server` - Express back end
- `server/data/cars.json` - vehicle data
- `server/data/bookings.json` - confirmed bookings
- `server/data/users.json` - registered accounts with hashed passwords

## Install

From the main `ozcar-rent` folder:

```bash
npm install
```

Do not commit `node_modules`.

## Run

Open two terminals in the main project folder.

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run client
```

Open:

```text
http://localhost:5173
```

The Express API runs on `http://localhost:3000`. Vite proxies `/api` requests to the server.

## Main flow

1. Select pick-up and return dates.
2. Search vehicle availability.
3. Select an available car.
4. Add optional extras.
5. Review the server-calculated quote.
6. Sign in or create an account.
7. Confirm the booking using the authenticated account.
8. Receive a unique booking reference.
9. Open the account area to view confirmed bookings.

## Account system

- New users can register with name, email and password.
- Passwords are salted and hashed on the server before they are stored.
- Successful login creates a server-side session token.
- Booking creation and booking history require an authenticated account.
- The client keeps only the session token in local storage.
- Sessions are intentionally kept in memory for this coursework-scale application and reset when the Express server restarts.

## Availability test

Pick-up `18/09/2026` and return `21/09/2026` demonstrates existing booking conflicts from `server/data/bookings.json`.

## Responsive design

- Phone: one-column search, fleet and booking flow.
- Tablet: two-column fleet where space allows.
- Desktop: search panel on the left and three-column fleet on the right.
- After a car is selected, the fleet is replaced by the extras and review workspace to avoid unnecessary scrolling.
- Account and authentication interfaces are responsive modal panels.

## UX and accessibility refinements

- Search, fleet, quote and account views include loading, empty and error states.
- The previous quote is cleared whenever extras change so an outdated price cannot be confirmed.
- Date fields use valid minimum dates and the return date must be later than the pick-up date.
- Authentication and account dialogs support Escape-to-close, initial keyboard focus and visible focus states.
- Buttons use practical touch targets and small interface text has been increased for readability.
- Reduced-motion preferences are respected and the confirmation can be printed cleanly.
- A skip link and semantic main content region improve keyboard navigation.

## Testing

See `TESTING.md` for the account, booking and interface test record.
