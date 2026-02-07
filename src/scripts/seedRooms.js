require("dotenv").config();
const mongoose = require("mongoose");
const Room = require("../models/Room");

const imagePool = [
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=1400&q=80",
];

const titles = [
  "modern studio",
  "cozy loft",
  "business suite",
  "budget room",
  "penthouse view",
  "quiet corner",
  "city apartment",
  "near airport",
  "family home",
  "minimal stay",
  "gallery loft",
  "sunlit flat",
  "garden room",
  "smart studio",
  "downtown escape",
];

const cities = [
  "Astana",
  "Almaty",
  "Shymkent",
  "Karaganda",
  "Aktobe",
  "Pavlodar",
  "Taraz",
  "Atyrau",
  "Kostanay",
  "Kokshetau",
];

const streets = [
  "Turan Ave",
  "Kabanbay Batyr",
  "Dostyk",
  "Tauke Khan",
  "Seifullin",
  "Bukhar Zhyrau",
  "Abilkayyr Khan",
  "Abylai Khan",
  "Airport Road",
  "Lomonosov",
  "Mangilik El",
  "Satbayev",
  "Baitursynov",
  "Nurly Zhol",
  "Saryarka",
];

const amenitiesPool = [
  "wifi",
  "kitchen",
  "ac",
  "parking",
  "washer",
  "desk",
  "coffee",
  "balcony",
  "smart tv",
  "gym",
];

function pickAmenities(idx) {
  const start = idx % amenitiesPool.length;
  return [
    amenitiesPool[start],
    amenitiesPool[(start + 2) % amenitiesPool.length],
    amenitiesPool[(start + 5) % amenitiesPool.length],
  ];
}

const rooms = Array.from({ length: 100 }).map((_, idx) => {
  const title = `${titles[idx % titles.length]} ${idx + 1}`;
  const city = cities[idx % cities.length];
  const address = `${streets[idx % streets.length]} ${10 + (idx % 90)}`;
  const pricePerNight = 12000 + (idx % 20) * 1500;
  const maxGuests = 2 + (idx % 4);
  const imageA = imagePool[idx % imagePool.length];
  const imageB = imagePool[(idx + 3) % imagePool.length];

  return {
    title,
    city,
    address,
    pricePerNight,
    maxGuests,
    amenities: pickAmenities(idx),
    images: [imageA, imageB],
  };
});

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("mongodb connected (seedRooms)");

  await Room.deleteMany({});
  const result = await Room.insertMany(rooms);
  console.log("inserted rooms:", result.length);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
