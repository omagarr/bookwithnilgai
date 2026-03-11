import { ScriptStep, FlightOptionData, HotelOptionData, TransferOptionData, ExperienceOptionData } from '@/types/chat';

export interface ConversationState {
  travelerCount: number;
  selectedFlight: FlightOptionData | null;
  selectedHotel: HotelOptionData | null;
  selectedTransfer: TransferOptionData | null;
  selectedExperiences: ExperienceOptionData[];
}

// ==========================================
// Static card option data
// ==========================================

const flightOptions: FlightOptionData[] = [
  {
    id: 'flight-1',
    airline: 'Air France',
    departureTime: '08:30',
    arrivalTime: '10:55',
    departureAirport: 'LHR',
    arrivalAirport: 'CDG',
    duration: '2h 25m',
    stops: 0,
    price: 189,
    currency: '£',
  },
  {
    id: 'flight-2',
    airline: 'EasyJet',
    departureTime: '06:15',
    arrivalTime: '10:25',
    departureAirport: 'LGW',
    arrivalAirport: 'CDG',
    duration: '4h 10m',
    stops: 1,
    stopCity: 'Lyon',
    price: 112,
    currency: '£',
  },
  {
    id: 'flight-3',
    airline: 'British Airways',
    departureTime: '10:00',
    arrivalTime: '12:30',
    departureAirport: 'LHR',
    arrivalAirport: 'CDG',
    duration: '2h 30m',
    stops: 0,
    price: 215,
    currency: '£',
  },
  {
    id: 'flight-4',
    airline: 'Vueling',
    departureTime: '07:45',
    arrivalTime: '13:05',
    departureAirport: 'LGW',
    arrivalAirport: 'ORY',
    duration: '5h 20m',
    stops: 1,
    stopCity: 'Barcelona',
    price: 98,
    currency: '£',
  },
  {
    id: 'flight-5',
    airline: 'KLM',
    departureTime: '09:15',
    arrivalTime: '13:45',
    departureAirport: 'LHR',
    arrivalAirport: 'CDG',
    duration: '4h 30m',
    stops: 1,
    stopCity: 'Amsterdam',
    price: 145,
    currency: '£',
  },
];

const hotelOptions: HotelOptionData[] = [
  {
    id: 'hotel-1',
    name: 'Hôtel Le Marais Boutique',
    image: '/images/hotels/le-marais.jpg',
    stars: 4.3,
    location: 'Le Marais, 4th Arr.',
    amenities: ['wifi', 'breakfast', 'aircon'],
    pricePerNight: 180,
    totalPrice: 360,
    currency: '£',
    nights: 2,
  },
  {
    id: 'hotel-2',
    name: 'Maison Montmartre',
    image: '/images/hotels/montmartre.jpg',
    stars: 3.8,
    location: 'Montmartre, 18th Arr.',
    amenities: ['wifi', 'bar'],
    pricePerNight: 120,
    totalPrice: 240,
    currency: '£',
    nights: 2,
  },
  {
    id: 'hotel-3',
    name: 'The Parisian Suite',
    image: '/images/hotels/parisian-suite.jpg',
    stars: 4.9,
    location: 'Champs-Élysées, 8th Arr.',
    amenities: ['wifi', 'pool', 'spa', 'breakfast'],
    pricePerNight: 320,
    totalPrice: 640,
    currency: '£',
    nights: 2,
  },
  {
    id: 'hotel-4',
    name: 'Hôtel Saint-Germain',
    image: '/images/hotels/saint-germain.jpg',
    stars: 4.6,
    location: 'Saint-Germain, 6th Arr.',
    amenities: ['wifi', 'breakfast', 'bar'],
    pricePerNight: 210,
    totalPrice: 420,
    currency: '£',
    nights: 2,
  },
];

const transferOptions: TransferOptionData[] = [
  {
    id: 'transfer-1',
    vehicleType: 'Private Sedan',
    image: '/images/transfers/sedan.webp',
    duration: '45 min',
    capacity: 3,
    luggage: 2,
    doors: 4,
    fuelType: 'Petrol',
    price: 65,
    currency: '£',
  },
  {
    id: 'transfer-2',
    vehicleType: 'Shared Shuttle',
    image: '/images/transfers/shuttle.webp',
    duration: '60 min',
    capacity: 8,
    luggage: 2,
    doors: 2,
    fuelType: 'Diesel',
    price: 25,
    currency: '£',
  },
  {
    id: 'transfer-3',
    vehicleType: 'Premium Mercedes',
    image: '/images/transfers/mercedes.webp',
    duration: '40 min',
    capacity: 3,
    luggage: 3,
    doors: 4,
    fuelType: 'Electric',
    price: 95,
    currency: '£',
  },
];

const experienceOptions: ExperienceOptionData[] = [
  {
    id: 'exp-1',
    title: 'Eiffel Tower Skip-the-Line',
    image: '/images/experiences/eiffel-tower.jpg',
    duration: '2h',
    rating: 4.8,
    reviewCount: 12430,
    description: 'Skip the queues and head straight to the summit for breathtaking panoramic views of Paris.',
    pricePerPerson: 45,
    totalPrice: 90,
    currency: '£',
  },
  {
    id: 'exp-2',
    title: 'Seine River Dinner Cruise',
    image: '/images/experiences/seine-cruise.jpg',
    duration: '3h',
    rating: 4.9,
    reviewCount: 8920,
    description: 'Gourmet 3-course dinner cruise past illuminated landmarks.',
    pricePerPerson: 89,
    totalPrice: 178,
    currency: '£',
  },
  {
    id: 'exp-3',
    title: 'Louvre Museum Guided Tour',
    image: '/images/experiences/louvre.jpg',
    duration: '2.5h',
    rating: 4.7,
    reviewCount: 15280,
    description: 'Expert-led tour covering the Mona Lisa, Venus de Milo, and hidden gems.',
    pricePerPerson: 55,
    totalPrice: 110,
    currency: '£',
  },
  {
    id: 'exp-4',
    title: 'Wine & Cheese Tasting',
    image: '/images/experiences/wine-tasting.jpg',
    duration: '1.5h',
    rating: 4.9,
    reviewCount: 3450,
    description: 'Curated tasting of 5 French wines paired with artisan cheeses in Le Marais.',
    pricePerPerson: 65,
    totalPrice: 130,
    currency: '£',
  },
];

// ==========================================
// Dynamic script builder
// ==========================================

export function getScriptedConversation(state: ConversationState): ScriptStep[] {
  const { travelerCount: tc, selectedFlight: sf, selectedHotel: sh, selectedTransfer: st, selectedExperiences: se } = state;

  const plural = tc !== 1;
  const pax = `${tc} passenger${plural ? 's' : ''}`;

  // Compute totals from actual selections
  const flightTotal = sf ? sf.price * tc : 0;
  const hotelTotal = sh ? sh.totalPrice : 0;
  const transferTotal = st ? st.price : 0;
  const expItems = se.map(e => ({
    label: `${e.title} × ${tc}`,
    price: e.pricePerPerson * tc,
  }));
  const expTotal = expItems.reduce((sum, e) => sum + e.price, 0);
  const tripTotal = flightTotal + hotelTotal + transferTotal + expTotal;

  const buildTripSummary = () => ({
    flight: {
      label: sf ? `${sf.airline} · ${sf.departureAirport} → ${sf.arrivalAirport}` : '',
      details: sf
        ? `${sf.stops === 0 ? 'Direct' : `${sf.stops} stop`} · Mar 14, ${sf.departureTime} – ${sf.arrivalTime} · ${pax}`
        : '',
      price: flightTotal,
    },
    hotel: {
      label: sh ? `${sh.name} ${'★'.repeat(Math.round(sh.stars))}` : '',
      details: sh ? `${sh.location} · ${sh.nights} night${sh.nights > 1 ? 's' : ''} · Mar 14–16` : '',
      price: hotelTotal,
    },
    transfer: {
      label: st ? st.vehicleType : '',
      details: st
        ? `CDG → ${sh?.location || 'Hotel'} · ${st.duration}`
        : '',
      price: transferTotal,
    },
    experiences: expItems,
    currency: '£',
    totalPrice: tripTotal,
  });

  return [
    // Step 1: Welcome → Ask traveler count
    {
      trigger: 'userInput',
      userMessage: 'I want to plan a weekend trip to Paris',
      assistantMessages: [
        {
          content: "Great choice! Paris is wonderful for a weekend getaway. How many people are travelling?",
          delay: 1500,
          travelerCountOptions: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      ],
    },

    // Step 2: Traveler count selected → Ask dates
    {
      trigger: 'cardSelect',
      userMessage: `${tc} traveller${plural ? 's' : ''}`,
      assistantMessages: [
        {
          content: `Perfect, ${tc} traveller${plural ? 's' : ''}! When are you thinking of going?`,
          delay: 1500,
        },
      ],
    },

    // Step 3: Dates → Show flights
    {
      trigger: 'userInput',
      userMessage: 'This Friday to Sunday',
      assistantMessages: [
        {
          content: `Perfect, searching flights for March 14–16 for ${pax}...`,
          delay: 1500,
        },
        {
          content: "Here are the best options I found:",
          delay: 1500,
          flightOptions,
        },
      ],
    },

    // Step 4: Flight selected → Ask about accommodation preference
    {
      trigger: 'cardSelect',
      userMessage: sf
        ? `I'll take the ${sf.airline} flight`
        : "I'll take this flight",
      assistantMessages: [
        {
          content: sf
            ? `Excellent choice! ${sf.airline} ${sf.stops === 0 ? 'direct ' : ''}to ${sf.arrivalAirport} — confirmed for ${pax}. ✓\n\nNow for accommodation — are you looking for something boutique and central, or would you prefer to save on the hotel and splurge on experiences?`
            : 'Flight confirmed! ✓\n\nAre you looking for something boutique and central, or prefer to keep costs down on the hotel?',
          delay: 1500,
        },
      ],
    },

    // Step 5: User responds about hotel preference → Show hotels
    {
      trigger: 'userInput',
      userMessage: 'Something central with good vibes',
      assistantMessages: [
        {
          content: "Love it — I've filtered for character-rich stays in the best neighbourhoods. Here are my top picks:",
          delay: 1500,
          hotelOptions,
        },
      ],
    },

    // Step 6: Hotel selected → Ask about transfer preference
    {
      trigger: 'cardSelect',
      userMessage: sh
        ? `Book ${sh.name}`
        : 'Book this hotel',
      assistantMessages: [
        {
          content: sh
            ? `Great taste! ${sh.name} — ${sh.nights} nights booked. ✓\n\nHow would you like to get from the airport to your hotel — private car, or happy to share a shuttle and save a bit?`
            : 'Hotel booked! ✓\n\nHow would you like to get from the airport — private or shared?',
          delay: 1500,
        },
      ],
    },

    // Step 7: User responds about transfer preference → Show transfers
    {
      trigger: 'userInput',
      userMessage: 'Private would be nice, what are the options?',
      assistantMessages: [
        {
          content: sh
            ? `Here are the transfer options from CDG to ${sh.location}:`
            : "Here are your transfer options from CDG:",
          delay: 1500,
          transferOptions,
        },
      ],
    },

    // Step 8: Transfer selected → Ask about experiences
    {
      trigger: 'cardSelect',
      userMessage: st
        ? `The ${st.vehicleType.toLowerCase()} looks good`
        : 'This transfer looks good',
      assistantMessages: [
        {
          content: st
            ? `${st.vehicleType} transfer confirmed — pickup at CDG Terminal 2. ✓\n\nNow for the fun part! Any particular interests — culture, food & wine, sightseeing? Or shall I show you the most popular experiences?`
            : 'Transfer confirmed! ✓\n\nAny particular interests for activities — culture, food, adventure?',
          delay: 1500,
        },
      ],
    },

    // Step 9: User responds about experience preference → Show experiences
    {
      trigger: 'userInput',
      userMessage: 'A mix of sightseeing and food experiences',
      assistantMessages: [
        {
          content: "Perfect combo! Here are the best-rated experiences that match — you can add as many as you like:",
          delay: 1500,
          experienceOptions,
        },
      ],
    },

    // Step 10: Experiences selected → Trip confirmation with total + checkout
    {
      trigger: 'cardSelect',
      userMessage: se.length > 0
        ? `Add ${se.map(e => e.title).join(' and ')}`
        : 'Add these experiences',
      assistantMessages: [
        {
          content: "Great choices! Here's what I've added:",
          delay: 1500,
          tripConfirmation: {
            selectedExperiences: expItems,
            tripTotal,
            currency: '£',
          },
        },
      ],
    },

    // Step 11: Checkout → Trip summary
    {
      trigger: 'cardSelect',
      userMessage: 'Proceed to checkout',
      assistantMessages: [
        {
          content: "Here's your complete Paris weekend:",
          delay: 1500,
          tripSummary: buildTripSummary(),
        },
      ],
    },

    // Step 12: Booking confirmation flow
    {
      trigger: 'cardSelect',
      userMessage: "Let's book it!",
      assistantMessages: [
        {
          content: "Here's your final booking summary. Please confirm to proceed:",
          delay: 1000,
          bookingConfirmation: {
            tripSummary: buildTripSummary(),
          },
        },
      ],
    },

    // Step 13: Booking complete
    {
      trigger: 'cardSelect',
      userMessage: 'Confirmed!',
      assistantMessages: [
        {
          content: '',
          delay: 0,
          bookingProcessing: true,
        },
        {
          content: '',
          delay: 4000,
          bookingComplete: {
            bookingRef: 'NLG-PAR-2026-7842',
            tripSummary: buildTripSummary(),
          },
        },
      ],
    },
  ];
}
