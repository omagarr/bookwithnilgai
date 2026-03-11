import { getScriptedConversation, ConversationState } from '../src/lib/scriptedConversation';
import { ScriptStep } from '../src/types/chat';

// Default state simulating a completed demo flow
const defaultState: ConversationState = {
  travelerCount: 2,
  selectedFlight: {
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
  selectedHotel: {
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
  selectedTransfer: {
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
  selectedExperiences: [
    {
      id: 'exp-1',
      title: 'Eiffel Tower Skip-the-Line',
      image: '/images/experiences/eiffel-tower.jpg',
      duration: '2h',
      rating: 4.8,
      reviewCount: 12430,
      description: 'Skip the queues.',
      pricePerPerson: 45,
      totalPrice: 90,
      currency: '£',
    },
    {
      id: 'exp-4',
      title: 'Wine & Cheese Tasting',
      image: '/images/experiences/wine-tasting.jpg',
      duration: '1.5h',
      rating: 4.9,
      reviewCount: 3450,
      description: 'Curated tasting.',
      pricePerPerson: 65,
      totalPrice: 130,
      currency: '£',
    },
  ],
};

describe('Scripted Conversation', () => {
  const scriptedConversation = getScriptedConversation(defaultState);

  it('should be a non-empty array', () => {
    expect(Array.isArray(scriptedConversation)).toBe(true);
    expect(scriptedConversation.length).toBeGreaterThan(0);
  });

  it('every step should have required fields', () => {
    scriptedConversation.forEach((step: ScriptStep) => {
      expect(step.trigger).toBeDefined();
      expect(['userInput', 'cardSelect']).toContain(step.trigger);
      expect(typeof step.userMessage).toBe('string');
      expect(step.userMessage.length).toBeGreaterThan(0);
      expect(Array.isArray(step.assistantMessages)).toBe(true);
      expect(step.assistantMessages.length).toBeGreaterThan(0);
    });
  });

  it('every assistant message should have a delay', () => {
    scriptedConversation.forEach((step: ScriptStep) => {
      step.assistantMessages.forEach((msg) => {
        expect(typeof msg.delay).toBe('number');
        expect(msg.delay).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('every assistant message should have content or rich content', () => {
    scriptedConversation.forEach((step: ScriptStep) => {
      step.assistantMessages.forEach((msg) => {
        const hasContent = msg.content.length > 0;
        const hasRichContent =
          msg.flightOptions ||
          msg.hotelOptions ||
          msg.transferOptions ||
          msg.experienceOptions ||
          msg.travelerCountOptions ||
          msg.tripConfirmation ||
          msg.tripSummary ||
          msg.bookingConfirmation ||
          msg.bookingProcessing ||
          msg.bookingComplete;
        expect(hasContent || !!hasRichContent).toBe(true);
      });
    });
  });

  it('should have the correct number of steps (13)', () => {
    expect(scriptedConversation.length).toBe(13);
  });

  it('first step should trigger on userInput', () => {
    expect(scriptedConversation[0].trigger).toBe('userInput');
  });

  it('flight options step should have 5 flights', () => {
    const flightStep = scriptedConversation.find((step: ScriptStep) =>
      step.assistantMessages.some((m) => m.flightOptions)
    );
    expect(flightStep).toBeDefined();
    const flightMsg = flightStep!.assistantMessages.find((m) => m.flightOptions);
    expect(flightMsg!.flightOptions!.length).toBe(5);
  });

  it('all flight options should have unique IDs', () => {
    const flightStep = scriptedConversation.find((step: ScriptStep) =>
      step.assistantMessages.some((m) => m.flightOptions)
    );
    const flights = flightStep!.assistantMessages.find((m) => m.flightOptions)!.flightOptions!;
    const ids = flights.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hotel options should have valid star ratings (1-5)', () => {
    const hotelStep = scriptedConversation.find((step: ScriptStep) =>
      step.assistantMessages.some((m) => m.hotelOptions)
    );
    const hotels = hotelStep!.assistantMessages.find((m) => m.hotelOptions)!.hotelOptions!;
    hotels.forEach((hotel) => {
      expect(hotel.stars).toBeGreaterThanOrEqual(1);
      expect(hotel.stars).toBeLessThanOrEqual(5);
    });
  });

  it('trip summary total should equal sum of all items', () => {
    const summaryStep = scriptedConversation.find((step: ScriptStep) =>
      step.assistantMessages.some((m) => m.tripSummary)
    );
    const summary = summaryStep!.assistantMessages.find((m) => m.tripSummary)!.tripSummary!;
    const itemsTotal =
      summary.flight.price +
      summary.hotel.price +
      summary.transfer.price +
      summary.experiences.reduce((sum, exp) => sum + exp.price, 0);
    expect(summary.totalPrice).toBe(itemsTotal);
  });

  it('booking complete step should have a booking reference', () => {
    const completeStep = scriptedConversation.find((step: ScriptStep) =>
      step.assistantMessages.some((m) => m.bookingComplete)
    );
    expect(completeStep).toBeDefined();
    const completeMsg = completeStep!.assistantMessages.find((m) => m.bookingComplete);
    expect(completeMsg!.bookingComplete!.bookingRef).toBeDefined();
    expect(completeMsg!.bookingComplete!.bookingRef.length).toBeGreaterThan(0);
  });

  it('delays should be reasonable (0-10000ms)', () => {
    scriptedConversation.forEach((step: ScriptStep) => {
      step.assistantMessages.forEach((msg) => {
        expect(msg.delay).toBeLessThanOrEqual(10000);
      });
    });
  });

  it('should dynamically compute prices based on traveler count', () => {
    const state3: ConversationState = { ...defaultState, travelerCount: 3 };
    const script3 = getScriptedConversation(state3);
    const summary3 = script3.find((s: ScriptStep) =>
      s.assistantMessages.some((m) => m.tripSummary)
    )!.assistantMessages.find((m) => m.tripSummary)!.tripSummary!;

    // Flight: 189 × 3 = 567
    expect(summary3.flight.price).toBe(567);
    // Hotel stays the same (per room): 360
    expect(summary3.hotel.price).toBe(360);
    // Transfer stays the same (per vehicle): 65
    expect(summary3.transfer.price).toBe(65);
    // Experiences: (45 + 65) × 3 = 330
    const expTotal = summary3.experiences.reduce((sum, e) => sum + e.price, 0);
    expect(expTotal).toBe(330);
    // Total: 567 + 360 + 65 + 330 = 1322
    expect(summary3.totalPrice).toBe(1322);
  });

  it('should use selected item names in user messages', () => {
    const script = getScriptedConversation(defaultState);
    // Step 4 (index 3): flight selected
    expect(script[3].userMessage).toContain('Air France');
    // Step 6 (index 5): hotel selected
    expect(script[5].userMessage).toContain('Hôtel Le Marais Boutique');
    // Step 8 (index 7): transfer selected
    expect(script[7].userMessage).toContain('private sedan');
  });
});
