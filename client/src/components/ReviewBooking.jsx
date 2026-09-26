import { formatDate } from "../utils/date.js";

function ReviewBooking({
  selectedCar,
  pickupDate,
  returnDate,
  quote,
  user,
  onConfirm,
  onSignIn,
  loading,
  quoteLoading
}) {
  if (!selectedCar) {
    return null;
  }

  if (!quote) {
    return (
      <section className="review-panel review-loading" aria-busy="true" aria-live="polite">
        <div className="review-heading">
          <div>
            <p className="eyebrow">Step 3</p>
            <h3>Review booking</h3>
          </div>
          <span className="review-ready">Updating</span>
        </div>
        <div className="review-loading-state" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <div>
            <strong>Calculating your latest price</strong>
            <p>Your booking summary will be ready in a moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="review-panel" aria-busy={quoteLoading || loading}>
      <div className="review-heading">
        <div>
          <p className="eyebrow">Step 3</p>
          <h3>Review booking</h3>
        </div>

        <span className="review-ready">Ready</span>
      </div>

      <p className="review-intro">
        Check your rental details before confirming your booking.
      </p>

      <div className="review-car">
        <img
          src={selectedCar.image}
          alt={`${selectedCar.make} ${selectedCar.model}`}
        />

        <div>
          <span>Selected vehicle</span>
          <strong>{selectedCar.make} {selectedCar.model}</strong>
        </div>
      </div>

      <div className="review-details">
        <div>
          <span>Pick-up</span>
          <strong>{formatDate(pickupDate)}</strong>
        </div>

        <div>
          <span>Return</span>
          <strong>{formatDate(returnDate)}</strong>
        </div>

        <div>
          <span>Rental period</span>
          <strong>{quote.rentalDays} {quote.rentalDays === 1 ? "day" : "days"}</strong>
        </div>

        <div>
          <span>Vehicle</span>
          <strong>£{quote.carTotal}</strong>
        </div>

        <div>
          <span>Extras</span>
          <strong>£{quote.extrasTotal}</strong>
        </div>
      </div>

      {quote.extras.length > 0 && (
        <div className="review-extras">
          <span>Selected extras</span>
          <ul>
            {quote.extras.map((extra) => (
              <li key={extra.id}>
                <span>{extra.name}</span>
                <strong>+£{extra.dailyPrice}/day</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="review-total">
        <span>Total price</span>
        <strong>£{quote.total}</strong>
      </div>

      {user ? (
        <div className="signed-in-booking">
          <div>
            <span>Booking as</span>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <button
            className="confirm-booking-button"
            type="button"
            onClick={onConfirm}
            disabled={loading || quoteLoading}
          >
            {quoteLoading ? "Updating price..." : loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      ) : (
        <div className="signin-to-book">
          <div>
            <strong>Sign in to confirm</strong>
            <p>Your booking will be saved to your account.</p>
          </div>
          <button className="auth-submit" type="button" onClick={onSignIn}>Sign in or register</button>
        </div>
      )}
    </section>
  );
}

export default ReviewBooking;
