import cors from "cors";
import crypto from "crypto";
import express from "express";
import fs from "fs";
import { searchCarAvailability } from "./services/availabilityService.js";
import { createUser, normaliseEmail, publicUser, validEmail, verifyPassword } from "./services/authService.js";
import { readJsonFile } from "./services/dataService.js";

const app = express();
const PORT = 3000;

const carsFile = new URL("./data/cars.json", import.meta.url);
const bookingsFile = new URL("./data/bookings.json", import.meta.url);
const usersFile = new URL("./data/users.json", import.meta.url);
const sessions = new Map();

const extras = [
  { id: "child-seat", name: "Child Seat", dailyPrice: 8 },
  { id: "extra-driver", name: "Extra Driver", dailyPrice: 12 },
  { id: "premium-cover", name: "Premium Cover", dailyPrice: 10 }
];

app.use(cors());
app.use(express.json({ limit: "50kb" }));

function calculateRentalDays(pickupDate, returnDate) {
  const pickupTime = Date.parse(`${pickupDate}T00:00:00Z`);
  const returnTime = Date.parse(`${returnDate}T00:00:00Z`);
  return Math.round((returnTime - pickupTime) / 86400000);
}

function validDateRange(pickupDate, returnDate) {
  return Boolean(
    pickupDate &&
    returnDate &&
    pickupDate < returnDate &&
    calculateRentalDays(pickupDate, returnDate) > 0
  );
}

function findCar(cars, carId) {
  return cars.find((car) => car.id === Number(carId));
}

function createQuote(car, pickupDate, returnDate, extraIds = []) {
  const rentalDays = calculateRentalDays(pickupDate, returnDate);
  const requestedExtras = Array.isArray(extraIds) ? extraIds : [];
  const selectedExtras = extras.filter((extra) => requestedExtras.includes(extra.id));
  const carTotal = car.dailyPrice * rentalDays;
  const extrasTotal = selectedExtras.reduce(
    (total, extra) => total + extra.dailyPrice * rentalDays,
    0
  );

  return {
    rentalDays,
    carTotal,
    selectedExtras,
    extrasTotal,
    total: carTotal + extrasTotal
  };
}

function createBookingReference(bookings) {
  const highestNumber = bookings.reduce((highest, booking) => {
    const number = Number(String(booking.id).replace("OZR", ""));
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 1000);

  return `OZR${highestNumber + 1}`;
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, user.id);
  return token;
}

function authToken(req) {
  const value = req.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function requireAuth(req, res, next) {
  const token = authToken(req);
  const userId = sessions.get(token);

  if (!userId) {
    return res.status(401).json({ message: "Please sign in to continue" });
  }

  const user = readJsonFile(usersFile).find((item) => item.id === userId);

  if (!user) {
    sessions.delete(token);
    return res.status(401).json({ message: "Your session is no longer valid" });
  }

  req.user = user;
  req.authToken = token;
  return next();
}

app.get("/", (req, res) => {
  res.json({ message: "Ozcar Rent server is running" });
});

app.post("/api/auth/register", (req, res) => {
  const { name = "", email = "", password = "" } = req.body;
  const users = readJsonFile(usersFile);
  const cleanEmail = normaliseEmail(email);

  if (name.trim().length < 2) {
    return res.status(400).json({ message: "Please enter your full name" });
  }

  if (!validEmail(cleanEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  if (users.some((user) => user.email === cleanEmail)) {
    return res.status(409).json({ message: "An account already exists with this email" });
  }

  const user = createUser(usersFile, { name, email: cleanEmail, password });
  const token = createSession(user);

  return res.status(201).json({ token, user: publicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const { email = "", password = "" } = req.body;
  const cleanEmail = normaliseEmail(email);
  const user = readJsonFile(usersFile).find((item) => item.email === cleanEmail);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  const token = createSession(user);
  return res.json({ token, user: publicUser(user) });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  sessions.delete(req.authToken);
  res.json({ message: "Signed out" });
});

app.get("/api/my-bookings", requireAuth, (req, res) => {
  const cars = readJsonFile(carsFile);
  const bookings = readJsonFile(bookingsFile)
    .filter((booking) => booking.userId === req.user.id)
    .map((booking) => {
      const car = findCar(cars, booking.carId);
      return {
        ...booking,
        car: car ? { make: car.make, model: car.model, image: car.image } : null
      };
    })
    .sort((a, b) => b.pickupDate.localeCompare(a.pickupDate));

  res.json(bookings);
});

app.get("/api/cars", (req, res) => {
  res.json(readJsonFile(carsFile));
});

app.get("/api/extras", (req, res) => {
  res.json(extras);
});

app.post("/api/search-availability", (req, res) => {
  const { pickupDate, returnDate } = req.body;

  if (!validDateRange(pickupDate, returnDate)) {
    return res.status(400).json({
      message: "Return date must be after the pick-up date"
    });
  }

  const cars = readJsonFile(carsFile);
  const bookings = readJsonFile(bookingsFile);

  return res.json({
    pickupDate,
    returnDate,
    cars: searchCarAvailability(cars, bookings, pickupDate, returnDate)
  });
});

app.post("/api/quote", (req, res) => {
  const { carId, pickupDate, returnDate, extraIds = [] } = req.body;

  if (!carId || !validDateRange(pickupDate, returnDate)) {
    return res.status(400).json({
      message: "Car and valid rental dates are required"
    });
  }

  const cars = readJsonFile(carsFile);
  const car = findCar(cars, carId);

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  const quote = createQuote(car, pickupDate, returnDate, extraIds);

  return res.json({
    car: {
      id: car.id,
      make: car.make,
      model: car.model,
      dailyPrice: car.dailyPrice
    },
    pickupDate,
    returnDate,
    rentalDays: quote.rentalDays,
    carTotal: quote.carTotal,
    extras: quote.selectedExtras,
    extrasTotal: quote.extrasTotal,
    total: quote.total
  });
});

app.post("/api/bookings", requireAuth, (req, res) => {
  const { carId, pickupDate, returnDate, extraIds = [] } = req.body;

  if (!carId || !validDateRange(pickupDate, returnDate)) {
    return res.status(400).json({
      message: "Please complete all booking details"
    });
  }

  const cars = readJsonFile(carsFile);
  const bookings = readJsonFile(bookingsFile);
  const car = findCar(cars, carId);

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  const availability = searchCarAvailability(
    cars,
    bookings,
    pickupDate,
    returnDate
  );

  const selectedCar = availability.find((vehicle) => vehicle.id === car.id);

  if (!selectedCar?.available) {
    return res.status(409).json({
      message: "This vehicle is no longer available for the selected dates"
    });
  }

  const quote = createQuote(car, pickupDate, returnDate, extraIds);
  const booking = {
    id: createBookingReference(bookings),
    userId: req.user.id,
    carId: car.id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    pickupDate,
    returnDate,
    extraIds: quote.selectedExtras.map((extra) => extra.id),
    total: quote.total,
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  fs.writeFileSync(bookingsFile, `${JSON.stringify(bookings, null, 2)}\n`, "utf8");

  return res.status(201).json({
    message: "Booking confirmed",
    bookingReference: booking.id,
    customerName: booking.customerName,
    car: {
      id: car.id,
      make: car.make,
      model: car.model,
      image: car.image
    },
    pickupDate,
    returnDate,
    rentalDays: quote.rentalDays,
    extras: quote.selectedExtras,
    total: quote.total
  });
});


app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must contain valid JSON" });
  }

  console.error(error);
  return res.status(500).json({ message: "The server could not complete this request" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
