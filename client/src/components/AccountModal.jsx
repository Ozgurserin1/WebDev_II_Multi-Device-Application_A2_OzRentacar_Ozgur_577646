import { useEffect, useRef } from "react";
import { formatDate } from "../utils/date.js";

function AccountModal({ open, user, bookings, loading, message, onClose, onLogout }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onClose]);

  if (!open || !user) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={loading ? undefined : onClose}>
      <section
        className="account-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
        aria-describedby="account-description"
        aria-busy={loading}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close account window"
          disabled={loading}
        >
          ×
        </button>

        <p className="eyebrow">Your account</p>
        <h2 id="account-title">{user.name}</h2>
        <p className="account-email" id="account-description">{user.email}</p>

        <div className="account-section-heading">
          <div>
            <h3>My bookings</h3>
            <p>Your confirmed rentals are linked to this account.</p>
          </div>
          <span aria-label={`${bookings.length} bookings`}>{bookings.length}</span>
        </div>

        {loading && (
          <div className="account-loading" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            <span>Loading bookings...</span>
          </div>
        )}
        {message && <p className="auth-message" role="alert">{message}</p>}

        {!loading && !message && bookings.length === 0 && (
          <div className="empty-bookings">
            <strong>No bookings yet</strong>
            <p>Your next confirmed booking will appear here.</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="booking-history">
            {bookings.map((booking) => (
              <article className="history-card" key={booking.id}>
                {booking.car?.image && (
                  <img src={booking.car.image} alt={`${booking.car.make} ${booking.car.model}`} />
                )}
                <div className="history-card-content">
                  <div className="history-card-heading">
                    <div>
                      <span>{booking.id}</span>
                      <strong>{booking.car ? `${booking.car.make} ${booking.car.model}` : "Vehicle"}</strong>
                    </div>
                    {Number.isFinite(booking.total) && <strong>£{booking.total}</strong>}
                  </div>
                  <p>{formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <button className="logout-button" type="button" onClick={onLogout} disabled={loading}>
          Sign out
        </button>
      </section>
    </div>
  );
}

export default AccountModal;
