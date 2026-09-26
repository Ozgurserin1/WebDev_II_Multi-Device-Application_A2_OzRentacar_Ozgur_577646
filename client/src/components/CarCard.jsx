function CarCard({ car, hasSearched, selected, onSelect }) {
  const unavailable = hasSearched && !car.available;

  return (
    <article className={`car-card ${unavailable ? "car-unavailable" : ""} ${selected ? "car-selected" : ""}`}>
      <div className="car-image-wrapper">
        <img className="car-image" src={car.image} alt={`${car.make} ${car.model}`} />

        <div className="image-badges">
          {car.featured && <span className="featured-badge">Featured</span>}
          {hasSearched && (
            <span className={`availability-badge ${car.available ? "available" : "unavailable"}`}>
              {car.available ? "Available" : "Unavailable"}
            </span>
          )}
        </div>
      </div>

      <div className="car-content">
        <div className="car-title-row">
          <div>
            <p className="car-year">{car.year} · {car.tier}</p>
            <h3>{car.make} {car.model}</h3>
          </div>
          <div className="car-price">
            <strong>£{car.dailyPrice}</strong>
            <span>/ day</span>
          </div>
        </div>

        <div className="car-details" aria-label="Vehicle details">
          <span>{car.transmission}</span>
          <span>{car.fuel}</span>
          <span>{car.seats} seats</span>
          <span>{car.category}</span>
        </div>

        <button
          type="button"
          disabled={!hasSearched || unavailable}
          onClick={() => onSelect(car)}
        >
          {!hasSearched
            ? "Select dates first"
            : unavailable
              ? "Unavailable"
              : selected
                ? "Selected"
                : "Select car"}
        </button>
      </div>
    </article>
  );
}

export default CarCard;
