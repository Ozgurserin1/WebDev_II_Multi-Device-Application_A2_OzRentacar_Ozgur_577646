import { formatDate } from "../utils/date.js";

function BookingConfirmation({ booking, onNewBooking }) {
  return (
    <section className="confirmation-page" aria-labelledby="confirmation-title">
      <div className="confirmation-card">
        <div className="confirmation-icon" aria-hidden="true">✓</div>
        <p className="eyebrow">Booking confirmed</p>
        <h2 id="confirmation-title">Thank you, {booking.customerName}</h2>
        <p className="confirmation-lead">
          Your rental has been successfully booked. Keep your booking reference for your records.
        </p>

        <div className="booking-reference">
          <span>Booking reference</span>
          <strong>{booking.bookingReference}</strong>
        </div>

        <div className="confirmation-main">
          <img
            src={booking.car.image}
            alt={`${booking.car.make} ${booking.car.model}`}
          />

          <div className="confirmation-summary">
            <div>
              <span>Vehicle</span>
              <strong>{booking.car.make} {booking.car.model}</strong>
            </div>
            <div>
              <span>Pick-up</span>
              <strong>{formatDate(booking.pickupDate)}</strong>
            </div>
            <div>
              <span>Return</span>
              <strong>{formatDate(booking.returnDate)}</strong>
            </div>
            <div>
              <span>Rental period</span>
              <strong>{booking.rentalDays} {booking.rentalDays === 1 ? "day" : "days"}</strong>
            </div>
            <div className="confirmation-total-row">
              <span>Total</span>
              <strong>£{booking.total}</strong>
            </div>
          </div>
        </div>

        {booking.extras.length > 0 && (
          <div className="confirmation-extras">
            <span>Extras</span>
            <div>
              {booking.extras.map((extra) => (
                <strong key={extra.id}>{extra.name}</strong>
              ))}
            </div>
          </div>
        )}

        <div className="confirmation-actions">
          <button className="secondary-action" type="button" onClick={() => window.print()}>
            Print confirmation
          </button>
          <button className="new-booking-button" type="button" onClick={onNewBooking}>
            Make another booking
          </button>
        </div>
      </div>
    </section>
  );
}

export default BookingConfirmation;
