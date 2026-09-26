function ExtrasPanel({
  extras,
  selectedExtraIds,
  onToggle,
  quote,
  loading
}) {
  return (
    <section className="extras-panel" aria-label="Optional extras" aria-busy={loading}>
      <div className="extras-heading">
        <div>
          <p className="eyebrow">Step 2</p>
          <h3>Add extras</h3>
        </div>

        <span className="optional-label">Optional</span>
      </div>

      <p className="extras-intro">
        Personalise your rental with optional extras.
      </p>

      <div className="extras-list">
        {extras.map((extra) => {
          const selected = selectedExtraIds.includes(extra.id);

          return (
            <label
              className={`extra-option ${
                selected ? "extra-selected" : ""
              }`}
              key={extra.id}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle(extra.id)}
              />

              <span className="extra-check" aria-hidden="true">
                {selected ? "✓" : ""}
              </span>

              <span className="extra-info">
                <strong>{extra.name}</strong>
                <small>Added for each rental day</small>
              </span>

              <span className="extra-price">
                +£{extra.dailyPrice}
                <small>/ day</small>
              </span>
            </label>
          );
        })}
      </div>

      {loading && (
        <p className="quote-status" role="status">Updating price...</p>
      )}

      {quote && !loading && (
        <div className="quote-breakdown">
          <div>
            <span>Vehicle</span>
            <strong>£{quote.carTotal}</strong>
          </div>

          <div>
            <span>Extras</span>
            <strong>£{quote.extrasTotal}</strong>
          </div>

          <div className="quote-total">
            <span>Total</span>
            <strong>£{quote.total}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default ExtrasPanel;