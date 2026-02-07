# Room Booking (MERN)

## Overview
Rooms marketplace for search, booking, reviews, and admin analytics.

## Data
- `users`: `email`, `name`, `passwordHash`, `role`, `createdAt`
- `rooms`: `title`, `city`, `address`, `pricePerNight`, `maxGuests`, `amenities`, `images`, `isActive`, `avgRating`, `reviewsCount`, `bookingsCount`, `createdAt`
- `bookings`: `userId`, `roomId`, `checkIn`, `checkOut`, `status`, `totalPrice`, `createdAt`
- `reviews`: `userId`, `roomId`, `rating`, `text`, `createdAt`
- `contactmessages`: `firstName`, `lastName`, `email`, `phone`, `subject`, `message`, `createdAt`

## API
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/rooms` (admin)
- `PUT /api/rooms/:id` (admin)
- `PATCH /api/rooms/:id/amenities` (admin)
- `DELETE /api/rooms/:id` (admin)
- `POST /api/bookings`
- `GET /api/bookings/my`
- `PATCH /api/bookings/:id/cancel`
- `POST /api/reviews`
- `DELETE /api/reviews/:id`
- `POST /api/contact`
- `GET /api/admin/bookings` (admin)
- `POST /api/admin/bookings` (admin)
- `PATCH /api/admin/bookings/:id/confirm` (admin)
- `PATCH /api/admin/bookings/:id` (admin)
- `DELETE /api/admin/bookings/:id` (admin)
- `GET /api/admin/analytics/top-rooms` (admin)
- `GET /api/admin/rooms` (admin)
- `GET /api/analytics/rooms-by-city`

## Example
`/api/analytics/rooms-by-city`
```bash
curl -s http://localhost:5000/api/analytics/rooms-by-city
```
```json
{
  "items": [
    { "city": "Berlin", "roomsCount": 4, "avgPrice": 92.5 },
    { "city": "Paris", "roomsCount": 2, "avgPrice": 135.0 }
  ]
}
```

## Indexes
- `rooms`: `{ city: 1, pricePerNight: 1 }` speeds city/price filtering and sorting.
- `rooms`: `{ createdAt: -1 }` speeds newest rooms sorting.
- `bookings`: `{ userId: 1, createdAt: -1 }` speeds "my bookings".
- `bookings`: `{ status: 1, checkIn: 1, roomId: 1 }` speeds analytics and period/status queries.
- `bookings`: unique `{ userId: 1, roomId: 1, checkIn: 1, checkOut: 1 }` prevents duplicate bookings.
- `reviews`: unique `{ userId: 1, roomId: 1 }` enforces one review per room per user.
- `users`: unique `email` speeds login and prevents duplicates.

## Notes
Do not commit `.env` or secrets.
