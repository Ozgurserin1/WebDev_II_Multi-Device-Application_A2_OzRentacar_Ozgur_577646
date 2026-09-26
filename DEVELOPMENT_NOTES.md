# Development Notes

## Current refinement pass

### Pricing consistency

When an optional extra changes, the previous quote is cleared immediately and a fresh quote is requested from the Express server. The review panel shows an updating state until the new total is returned. This prevents a stale price from remaining available for confirmation.

### Search and date validation

The search now has a loading state, the pick-up field prevents past dates in the browser, and the return field requires a later date. Changing the pick-up date clears an earlier return date when necessary. The Express API still validates the rental range independently.

### Loading, empty and error states

The fleet uses skeleton cards while data or availability is loading. A clear empty state is shown when a date search has no available vehicles. Quote, account and booking errors are shown near the relevant part of the interface rather than being silently ignored.

### Account experience

Registration and login remain connected to the server-side session system. The authentication dialog now includes a show/hide password control, keyboard focus, Escape handling and disabled controls while an account request is being processed. The account dialog presents formatted booking dates and loading/empty states.

### Accessibility

The application includes a skip link, a semantic main region, visible keyboard focus states, practical button target sizes, dialog labels, live/status messaging and reduced-motion support. Modal opening also prevents background-page scrolling.

### Responsive visual refinement

Very small interface text was increased for readability while keeping the compact visual hierarchy. The existing mobile-first one-column, tablet two-column and desktop sidebar/three-column structure is retained. Small-screen account/history layouts were refined for narrow widths.

### Booking confirmation

Confirmation dates use a human-readable UK format and the user can print a clean confirmation view. Print styling removes navigation and action controls.

### Server resilience

The JSON request body has a size limit and unknown API routes return JSON errors. Malformed JSON and unexpected server errors also return consistent JSON responses.
