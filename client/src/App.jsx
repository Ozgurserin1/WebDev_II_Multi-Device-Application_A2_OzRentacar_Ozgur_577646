import { useCallback, useEffect, useState } from "react";
import AccountModal from "./components/AccountModal.jsx";
import AuthModal from "./components/AuthModal.jsx";
import BookingConfirmation from "./components/BookingConfirmation.jsx";
import ExtrasPanel from "./components/ExtrasPanel.jsx";
import FleetSection from "./components/FleetSection.jsx";
import Header from "./components/Header.jsx";
import ReviewBooking from "./components/ReviewBooking.jsx";
import SearchPanel from "./components/SearchPanel.jsx";
import {
  clearToken,
  createBooking,
  getCars,
  getCurrentUser,
  getExtras,
  getMyBookings,
  getQuote,
  hasToken,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveToken,
  searchAvailability
} from "./services/api.js";
import "./App.css";

function calculateRentalDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) {
    return 0;
  }

  const pickupTime = Date.parse(`${pickupDate}T00:00:00Z`);
  const returnTime = Date.parse(`${returnDate}T00:00:00Z`);

  return Math.round((returnTime - pickupTime) / 86400000);
}

function App() {
  const [cars, setCars] = useState([]);
  const [extras, setExtras] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedExtraIds, setSelectedExtraIds] = useState([]);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [myBookings, setMyBookings] = useState([]);

  const closeAuth = useCallback(() => setAuthOpen(false), []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);

  useEffect(() => {
    Promise.all([getCars(), getExtras()])
      .then(([carsData, extrasData]) => {
        setCars(carsData);
        setExtras(extrasData);
      })
      .catch((error) => setMessage(error.message))
      .finally(() => setInitialLoading(false));

    if (hasToken()) {
      getCurrentUser()
        .then((data) => setUser(data.user))
        .catch(() => clearToken());
    }
  }, []);

  useEffect(() => {
    if (!selectedCar || !pickupDate || !returnDate || bookingConfirmation) {
      return undefined;
    }

    let active = true;
    queueMicrotask(() => {
      if (active) {
        setQuoteLoading(true);
      }
    });

    getQuote(selectedCar.id, pickupDate, returnDate, selectedExtraIds)
      .then((data) => {
        if (active) {
          setQuote(data);
          setMessage("");
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(error.message);
          setQuote(null);
        }
      })
      .finally(() => {
        if (active) {
          setQuoteLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedCar, selectedExtraIds, pickupDate, returnDate, bookingConfirmation]);

  useEffect(() => {
    if (!authOpen && !accountOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [authOpen, accountOpen]);

  async function handleSearch(event) {
    event.preventDefault();
    setMessage("");
    setSelectedCar(null);
    setSelectedExtraIds([]);
    setQuote(null);
    setBookingConfirmation(null);

    if (!pickupDate || !returnDate) {
      setMessage("Please select both rental dates.");
      return;
    }

    if (calculateRentalDays(pickupDate, returnDate) <= 0) {
      setMessage("Return date must be after the pick-up date.");
      return;
    }

    setSearchLoading(true);

    try {
      const data = await searchAvailability(pickupDate, returnDate);
      setCars(data.cars);
      setHasSearched(true);
      window.requestAnimationFrame(() => {
        document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSearchLoading(false);
    }
  }

  function resetSelection() {
    setSelectedCar(null);
    setSelectedExtraIds([]);
    setQuote(null);
    setBookingConfirmation(null);
    setMessage("");
  }

  function handleDateChange(setDate, value) {
    setDate(value);
    setHasSearched(false);
    resetSelection();
  }

  function handlePickupChange(value) {
    setPickupDate(value);
    if (returnDate && returnDate <= value) {
      setReturnDate("");
    }
    setHasSearched(false);
    resetSelection();
  }

  function handleSelectCar(car) {
    setSelectedCar(car);
    setSelectedExtraIds([]);
    setQuote(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleExtraToggle(extraId) {
    setQuote(null);
    setMessage("");
    setSelectedExtraIds((currentIds) =>
      currentIds.includes(extraId)
        ? currentIds.filter((id) => id !== extraId)
        : [...currentIds, extraId]
    );
  }

  async function handleConfirmBooking() {
    if (!user) {
      setAuthMessage("Please sign in before confirming your booking.");
      setAuthOpen(true);
      return;
    }

    if (!selectedCar || !quote || quoteLoading || bookingLoading) {
      return;
    }

    setBookingLoading(true);
    setMessage("");

    try {
      const booking = await createBooking({
        carId: selectedCar.id,
        pickupDate,
        returnDate,
        extraIds: selectedExtraIds
      });
      setBookingConfirmation(booking);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error.status === 401) {
        clearToken();
        setUser(null);
        setAuthMessage("Your session expired. Please sign in again.");
        setAuthOpen(true);
      } else {
        setMessage(error.message);
      }
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleNewBooking() {
    setPickupDate("");
    setReturnDate("");
    setHasSearched(false);
    resetSelection();
    setInitialLoading(true);

    try {
      setCars(await getCars());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setInitialLoading(false);
    }
  }

  async function handleLogin(credentials) {
    setAuthLoading(true);
    setAuthMessage("");

    try {
      const data = await loginAccount(credentials);
      saveToken(data.token);
      setUser(data.user);
      setAuthOpen(false);
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(details) {
    setAuthLoading(true);
    setAuthMessage("");

    try {
      const data = await registerAccount(details);
      saveToken(data.token);
      setUser(data.user);
      setAuthOpen(false);
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function openAuth() {
    setAuthMessage("");
    setAuthOpen(true);
  }

  async function openAccount() {
    if (!user) {
      openAuth();
      return;
    }

    setAccountOpen(true);
    setAccountLoading(true);
    setAccountMessage("");

    try {
      setMyBookings(await getMyBookings());
    } catch (error) {
      if (error.status === 401) {
        clearToken();
        setUser(null);
        setAccountOpen(false);
        setAuthMessage("Your session expired. Please sign in again.");
        setAuthOpen(true);
      } else {
        setAccountMessage(error.message);
      }
    } finally {
      setAccountLoading(false);
    }
  }

  async function handleLogout() {
    await logoutAccount().catch(() => undefined);
    clearToken();
    setUser(null);
    setMyBookings([]);
    setAccountOpen(false);
  }

  const rentalDays = calculateRentalDays(pickupDate, returnDate);

  if (bookingConfirmation) {
    return (
      <div className="app-shell">
        <Header
          user={user}
          onSignIn={openAuth}
          onAccount={openAccount}
          showFleetLink={false}
        />
        <main id="main-content">
          <BookingConfirmation
            booking={bookingConfirmation}
            onNewBooking={handleNewBooking}
          />
        </main>
        <AuthModal
          open={authOpen}
          onClose={closeAuth}
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
          message={authMessage}
        />
        <AccountModal
          open={accountOpen}
          user={user}
          bookings={myBookings}
          loading={accountLoading}
          message={accountMessage}
          onClose={closeAccount}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header user={user} onSignIn={openAuth} onAccount={openAccount} />

      <main id="main-content" className={`page-layout ${selectedCar ? "booking-layout" : "fleet-layout"}`}>
        <div className="sidebar-column">
          <SearchPanel
            pickupDate={pickupDate}
            returnDate={returnDate}
            rentalDays={rentalDays}
            hasSearched={hasSearched}
            message={selectedCar ? "" : message}
            selectedCar={selectedCar}
            searchLoading={searchLoading}
            onPickupChange={handlePickupChange}
            onReturnChange={(value) => handleDateChange(setReturnDate, value)}
            onSearch={handleSearch}
            onClearSelection={resetSelection}
          />
        </div>

        {!selectedCar && (
          <FleetSection
            cars={cars}
            hasSearched={hasSearched}
            selectedCar={selectedCar}
            onSelect={handleSelectCar}
            loading={initialLoading || searchLoading}
          />
        )}

        {selectedCar && (
          <section className="booking-workspace" aria-labelledby="booking-title">
            <div className="booking-workspace-header">
              <div>
                <p className="eyebrow">Complete your booking</p>
                <h2 id="booking-title">{selectedCar.make} {selectedCar.model}</h2>
                <p>Choose optional extras, review your details and confirm your booking.</p>
              </div>

              <button className="workspace-change-car" type="button" onClick={resetSelection}>
                Change car
              </button>
            </div>

            {message && <p className="workspace-message" role="alert">{message}</p>}

            <div className="booking-workspace-grid">
              <ExtrasPanel
                extras={extras}
                selectedExtraIds={selectedExtraIds}
                onToggle={handleExtraToggle}
                quote={quote}
                loading={quoteLoading}
              />

              <ReviewBooking
                selectedCar={selectedCar}
                pickupDate={pickupDate}
                returnDate={returnDate}
                quote={quote}
                user={user}
                onConfirm={handleConfirmBooking}
                onSignIn={openAuth}
                loading={bookingLoading}
                quoteLoading={quoteLoading}
              />
            </div>
          </section>
        )}
      </main>

      <AuthModal
        open={authOpen}
        onClose={closeAuth}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={authLoading}
        message={authMessage}
      />

      <AccountModal
        open={accountOpen}
        user={user}
        bookings={myBookings}
        loading={accountLoading}
        message={accountMessage}
        onClose={closeAccount}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
