import scriptedConversation from '../src/lib/scriptedConversation';
import { ScriptStep } from '../src/types/chat';

describe('Scripted Conversation', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(scriptedConversation)).toBe(true);
    expect(scriptedConversation.length).toBeGreaterThan(0);
  });

  it('every step should have required fields', () => {
    scriptedConversation.forEach((step: ScriptStep, index: number) => {
      expect(step.trigger).toBeDefined();
      expect(['userInput', 'cardSelect']).toContain(step.trigger);
      expect(typeof step.userMessage).toBe('string');
      expect(step.userMessage.length).toBeGreaterThan(0);
      expect(Array.isArray(step.assistantMessages)).toBe(true);
      expect(step.assistantMessages.length).toBeGreaterThan(0);
    });
  });

  it('every assistant message should have a delay', () => {
    scriptedConversation.forEach((step) => {
      step.assistantMessages.forEach((msg, msgIndex) => {
        expect(typeof msg.delay).toBe('number');
        expect(msg.delay).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('every assistant message should have content or rich content', () => {
    scriptedConversation.forEach((step) => {
      step.assistantMessages.forEach((msg) => {
        const hasContent = msg.content.length > 0;
        const hasRichContent =
          msg.flightOptions ||
          msg.hotelOptions ||
          msg.transferOptions ||
          msg.experienceOptions ||
          msg.tripSummary ||
          msg.bookingConfirmation ||
          msg.bookingProcessing ||
          msg.bookingComplete;
        expect(hasContent || !!hasRichContent).toBe(true);
      });
    });
  });

  it('should have the correct number of steps (8)', () => {
    expect(scriptedConversation.length).toBe(8);
  });

  it('first step should trigger on userInput', () => {
    expect(scriptedConversation[0].trigger).toBe('userInput');
  });

  it('flight options step should have 4 flights', () => {
    const flightStep = scriptedConversation.find((step) =>
      step.assistantMessages.some((m) => m.flightOptions)
    );
    expect(flightStep).toBeDefined();
    const flightMsg = flightStep!.assistantMessages.find((m) => m.flightOptions);
    expect(flightMsg!.flightOptions!.length).toBe(4);
  });

  it('all flight options should have unique IDs', () => {
    const flightStep = scriptedConversation.find((step) =>
      step.assistantMessages.some((m) => m.flightOptions)
    );
    const flights = flightStep!.assistantMessages.find((m) => m.flightOptions)!.flightOptions!;
    const ids = flights.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hotel options should have valid star ratings (1-5)', () => {
    const hotelStep = scriptedConversation.find((step) =>
      step.assistantMessages.some((m) => m.hotelOptions)
    );
    const hotels = hotelStep!.assistantMessages.find((m) => m.hotelOptions)!.hotelOptions!;
    hotels.forEach((hotel) => {
      expect(hotel.stars).toBeGreaterThanOrEqual(1);
      expect(hotel.stars).toBeLessThanOrEqual(5);
    });
  });

  it('trip summary total should equal sum of all items', () => {
    const summaryStep = scriptedConversation.find((step) =>
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
    const completeStep = scriptedConversation.find((step) =>
      step.assistantMessages.some((m) => m.bookingComplete)
    );
    expect(completeStep).toBeDefined();
    const completeMsg = completeStep!.assistantMessages.find((m) => m.bookingComplete);
    expect(completeMsg!.bookingComplete!.bookingRef).toBeDefined();
    expect(completeMsg!.bookingComplete!.bookingRef.length).toBeGreaterThan(0);
  });

  it('delays should be reasonable (0-10000ms)', () => {
    scriptedConversation.forEach((step) => {
      step.assistantMessages.forEach((msg) => {
        expect(msg.delay).toBeLessThanOrEqual(10000);
      });
    });
  });
});
