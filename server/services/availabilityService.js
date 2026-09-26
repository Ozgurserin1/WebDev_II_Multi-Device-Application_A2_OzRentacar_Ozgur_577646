export function searchCarAvailability(cars, bookings, pickupDate, returnDate) {
  return cars.map((car) => {
    const unavailable = bookings.some((booking) => {
      return (
        booking.carId === car.id &&
        pickupDate < booking.returnDate &&
        returnDate > booking.pickupDate
      );
    });

    return {
      ...car,
      available: !unavailable
    };
  });
}
