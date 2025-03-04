import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";

export const SelectTravelerList = [
  {
    id: 1,
    title: "Just Me",
    desc: "Explore by yourself.",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Die with a smile.",
    icon: "🥂",
    people: "2 people",
  },
  {
    id: 3,
    title: "Family",
    desc: "Enjoy the moment enjoy the life.",
    icon: "🏡",
    people: "3 to 5 people",
  },
  {
    id: 4,
    title: "Friends",
    desc: "Challenge with your friend.",
    icon: "⛵",
    people: "5 to 10 people",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "0 - 20,000,000VND",
    icon: "💵",
    range: "0 to 20000000",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "20,000,000 VND - 50,000,000 VND ",
    icon: "💰",
    range: "20000001 to 50000000",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "50,000,000 VND - 100,000,000 VND",
    icon: "💸",
    range: "50000001 to 100000000",
  },
];

export const SelectPayMethod = [
  {
    id: 1,
    title: "Paypal",
    icon: <Entypo name="paypal" size={24} color="black" />,
  },
  {
    id: 2,
    title: "Master Card",
    icon: <FontAwesome name="cc-mastercard" size={24} color="black" />,
  },
  {
    id: 3,
    title: "Credit Card",
    icon: <AntDesign name="creditcard" size={24} color="black" />,
  },
];

export const AI_PROMT =
  "{location}, {totalDays} Days and {totalNight} Night for {traveler} with a {budget} budget with Flight details, Flight Price with booking URL, Hotels options list with HotelName, Hotel address, Price, hotel image URL, geo coordinates, rating, descriptions and Places to visit nearby with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the locations for {totalDays} days and {totalNight}.";

