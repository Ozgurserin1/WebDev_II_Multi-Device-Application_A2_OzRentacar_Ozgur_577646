import { formatDate, nextDayIso, todayIso } from "../utils/date.js";

function SearchPanel({
  pickupDate,
  returnDate,
  rentalDays,
  hasSearched,
  message,
  selectedCar,
  searchLoading,
  onPickupChange,
  onReturnChange,
  onSearch,
  onClearSelection
}) {
  const minimumPickupDate = todayIso();
  const minimumReturnDate = nextDayIso(pickupDate || minimumPickupDate);

  return (
    <aside className="search-sidebar" aria-label="Car rental search">
      <div className="sidebar-intro">
        <p className="eyebrow">Book your car</p>
        <h2>Search availability</h2>
        <p>Choose your rental dates, then select an available vehicle from the fleet.</p>
      </div>

      <form className="sidebar-form" onSubmit={onSearch} aria-busy={searchLoading}>
        <label className="date-field" htmlFor="pickupDate">
          <span>Pick-up date</span>
          <input
            id="pickupDate"
            type="date"
            min={minimumPickupDate}
            value={pickupDate}
            onChange={(event) => onPickupChange(event.target.value)}
            required
          />
        </label>

        <label className="date-field" htmlFor="returnDate">
          <span>Return date</span>
          <input
            id="returnDate"
            type="date"
            min={minimumReturnDate}
            value={returnDate}
            onChange={(event) => onReturnChange(event.target.value)}
            required
          />
        </label>

        <button className="search-button" type="submit" disabled={searchLoading}>
          {searchLoading ? "Checking availability..." : "Search cars"}
        </button>
      </form>

      {message && <p className="search-message" role="alert">{message}</p>}

      {hasSearched && (
        <div className="rental-summary" aria-live="polite">
          <span>Rental period</span>
          <strong>{rentalDays} {rentalDays === 1 ? "day" : "days"}</strong>
        </div>
      )}

      {selectedCar && (
        <section className="trip-summary" aria-label="Selected car summary">
          <div className="trip-summary-heading">
            <div>
              <p className="eyebrow">Your trip</p>
              <h3>{selectedCar.make} {selectedCar.model}</h3>
            </div>
            <span className="selected-pill">Selected</span>
          </div>

          <img
            src={selectedCar.image}
            alt={`${selectedCar.make} ${selectedCar.model}`}
          />

          <dl className="trip-list">
            <div>
              <dt>Pick-up</dt>
              <dd>{formatDate(pickupDate)}</dd>
            </div>
            <div>
              <dt>Return</dt>
              <dd>{formatDate(returnDate)}</dd>
            </div>
            <div>
              <dt>Daily price</dt>
              <dd>£{selectedCar.dailyPrice}</dd>
            </div>
          </dl>

          <div className="trip-total">
            <span>Vehicle estimate</span>
            <strong>£{selectedCar.dailyPrice * rentalDays}</strong>
          </div>

          <button className="change-car-button" type="button" onClick={onClearSelection}>
            Change car
          </button>
        </section>
      )}
    </aside>
  );
}

export default SearchPanel;
