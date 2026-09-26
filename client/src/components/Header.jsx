function Header({ user, onSignIn, onAccount, showFleetLink = true }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="top-header">
        <div className="brand-block">
          <h1>
            <span className="brand-blue">OZ</span>
            <span className="brand-light"> RENT A CAR</span>
          </h1>
          <p>Smart availability. Clear pricing. Simple booking.</p>
        </div>

        <div className="header-actions">
          {showFleetLink && <a className="header-link" href="#fleet">Browse fleet</a>}
          <button
            className="account-button"
            type="button"
            onClick={user ? onAccount : onSignIn}
            aria-label={user ? `Open account for ${user.name}` : "Sign in or register"}
          >
            <span className="account-icon" aria-hidden="true">
              {user ? user.name.charAt(0).toUpperCase() : "↗"}
            </span>
            <span>{user ? user.name.split(" ")[0] : "Sign in"}</span>
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
