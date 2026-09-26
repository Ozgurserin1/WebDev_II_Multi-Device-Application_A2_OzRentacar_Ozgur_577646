import CarCard from "./CarCard.jsx";

function FleetSkeleton() {
  return (
    <div className="cars-grid" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="car-card skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="car-content">
            <div className="skeleton skeleton-line skeleton-line-short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FleetSection({ cars, hasSearched, selectedCar, onSelect, loading }) {
  const availableCount = hasSearched
    ? cars.filter((car) => car.available).length
    : cars.length;

  return (
    <section className="fleet-section" id="fleet" aria-busy={loading}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Our fleet</p>
          <h2>Choose your car</h2>
          <p className="section-description">
            Nine vehicles across premium, SUV, hatchback, electric and economy categories.
          </p>
        </div>

        <div className="fleet-count" aria-live="polite">
          <strong>{loading ? "—" : availableCount}</strong>
          <span>{hasSearched ? "available" : "vehicles"}</span>
        </div>
      </div>

      {loading ? (
        <FleetSkeleton />
      ) : (
        <>
          {hasSearched && availableCount === 0 && (
            <div className="fleet-empty-state" role="status">
              <strong>No cars are available for these dates</strong>
              <p>Choose a different pick-up or return date to search again.</p>
            </div>
          )}

          <div className="cars-grid">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                hasSearched={hasSearched}
                selected={selectedCar?.id === car.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default FleetSection;
