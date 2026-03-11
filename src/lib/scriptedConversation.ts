import { ScriptStep } from '@/types/chat';

const scriptedConversation: ScriptStep[] = [
  // Step 1: Welcome → Ask how many travelers
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
    userMessage: '2 travellers',
    assistantMessages: [
      {
        content: "Perfect, 2 travellers! When are you thinking of going?",
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
        content: "Perfect, searching flights for March 14–16...",
        delay: 1500,
      },
      {
        content: "Here are the best options I found:",
        delay: 1500,
        flightOptions: [
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
        ],
      },
    ],
  },

  // Step 4: Flight selected → Show hotels
  {
    trigger: 'cardSelect',
    userMessage: "I'll take the Air France direct flight",
    assistantMessages: [
      {
        content: "Excellent choice! Air France direct to CDG — confirmed for 2 passengers. ✓",
        delay: 1500,
      },
      {
        content: "Now let me find the perfect place to stay. Here are top picks in central Paris:",
        delay: 1500,
        hotelOptions: [
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
        ],
      },
    ],
  },

  // Step 5: Hotel selected → Show transfers
  {
    trigger: 'cardSelect',
    userMessage: 'Book the boutique hotel in Le Marais',
    assistantMessages: [
      {
        content: "Great taste! Hôtel Le Marais Boutique — 2 nights booked. ✓",
        delay: 1500,
      },
      {
        content: "Let me arrange your airport transfer from CDG to Le Marais:",
        delay: 1500,
        transferOptions: [
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
        ],
      },
    ],
  },

  // Step 6: Transfer selected → Show experiences
  {
    trigger: 'cardSelect',
    userMessage: 'The private sedan looks good',
    assistantMessages: [
      {
        content: "Private sedan transfer confirmed — pickup at CDG Terminal 2. ✓",
        delay: 1500,
      },
      {
        content: "Now for the fun part! Here are Paris must-do experiences for your weekend:",
        delay: 1500,
        experienceOptions: [
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
        ],
      },
    ],
  },

  // Step 7: Experiences selected → Trip confirmation with total + checkout
  {
    trigger: 'cardSelect',
    userMessage: 'Add the Eiffel Tower tour and the wine tasting',
    assistantMessages: [
      {
        content: "Great choices! Here's what I've added:",
        delay: 1500,
        tripConfirmation: {
          selectedExperiences: [
            { label: 'Eiffel Tower Skip-the-Line × 2', price: 90 },
            { label: 'Wine & Cheese Tasting × 2', price: 130 },
          ],
          tripTotal: 1023,
          currency: '£',
        },
      },
    ],
  },

  // Step 8: Checkout → Trip summary
  {
    trigger: 'cardSelect',
    userMessage: 'Proceed to checkout',
    assistantMessages: [
      {
        content: "Here's your complete Paris weekend:",
        delay: 1500,
        tripSummary: {
          flight: {
            label: 'Air France · LHR → CDG',
            details: 'Direct · Mar 14, 08:30 – 10:55 · 2 passengers',
            price: 378,
          },
          hotel: {
            label: 'Hôtel Le Marais Boutique ★★★★',
            details: 'Le Marais, 4th Arr. · 2 nights · Mar 14–16',
            price: 360,
          },
          transfer: {
            label: 'Private Sedan',
            details: 'CDG Terminal 2 → Le Marais · 45 min',
            price: 65,
          },
          experiences: [
            { label: 'Eiffel Tower Skip-the-Line × 2', price: 90 },
            { label: 'Wine & Cheese Tasting × 2', price: 130 },
          ],
          currency: '£',
          totalPrice: 1023,
        },
      },
    ],
  },

  // Step 9: Booking confirmation flow
  {
    trigger: 'cardSelect',
    userMessage: "Let's book it!",
    assistantMessages: [
      {
        content: "Here's your final booking summary. Please confirm to proceed:",
        delay: 1000,
        bookingConfirmation: {
          tripSummary: {
            flight: {
              label: 'Air France · LHR → CDG',
              details: 'Direct · Mar 14, 08:30 – 10:55 · 2 passengers',
              price: 378,
            },
            hotel: {
              label: 'Hôtel Le Marais Boutique ★★★★',
              details: 'Le Marais, 4th Arr. · 2 nights · Mar 14–16',
              price: 360,
            },
            transfer: {
              label: 'Private Sedan',
              details: 'CDG Terminal 2 → Le Marais · 45 min',
              price: 65,
            },
            experiences: [
              { label: 'Eiffel Tower Skip-the-Line × 2', price: 90 },
              { label: 'Wine & Cheese Tasting × 2', price: 130 },
            ],
            currency: '£',
            totalPrice: 1023,
          },
        },
      },
    ],
  },

  // Step 10: Booking complete (triggered by clicking Confirm on booking)
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
          tripSummary: {
            flight: {
              label: 'Air France · LHR → CDG',
              details: 'Direct · Mar 14, 08:30 – 10:55 · 2 passengers',
              price: 378,
            },
            hotel: {
              label: 'Hôtel Le Marais Boutique ★★★★',
              details: 'Le Marais, 4th Arr. · 2 nights · Mar 14–16',
              price: 360,
            },
            transfer: {
              label: 'Private Sedan',
              details: 'CDG Terminal 2 → Le Marais · 45 min',
              price: 65,
            },
            experiences: [
              { label: 'Eiffel Tower Skip-the-Line × 2', price: 90 },
              { label: 'Wine & Cheese Tasting × 2', price: 130 },
            ],
            currency: '£',
            totalPrice: 1023,
          },
        },
      },
    ],
  },
];

export default scriptedConversation;
