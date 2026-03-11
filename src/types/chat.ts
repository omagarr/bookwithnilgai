// ==========================================
// Scripted Conversation Types
// ==========================================

export interface ScriptStep {
  /** All assistant messages to show for this step */
  assistantMessages: ScriptedMessage[];
  /** The scripted user message displayed when this step is triggered */
  userMessage: string;
  /** How to advance: 'userInput' = any text/click, 'cardSelect' = must click a card */
  trigger: 'userInput' | 'cardSelect';
}

export interface ScriptedMessage {
  content: string;
  /** Milliseconds before showing this message (cumulative within step) */
  delay: number;
  flightOptions?: FlightOptionData[];
  hotelOptions?: HotelOptionData[];
  transferOptions?: TransferOptionData[];
  experienceOptions?: ExperienceOptionData[];
  tripSummary?: TripSummaryData;
  bookingConfirmation?: BookingConfirmationData;
  bookingProcessing?: boolean;
  bookingComplete?: BookingCompleteData;
}

// ==========================================
// Chat Message Type
// ==========================================

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isHidden?: boolean;
  // Rich content properties
  flightOptions?: FlightOptionData[];
  hotelOptions?: HotelOptionData[];
  transferOptions?: TransferOptionData[];
  experienceOptions?: ExperienceOptionData[];
  tripSummary?: TripSummaryData;
  bookingConfirmation?: BookingConfirmationData;
  bookingProcessing?: boolean;
  bookingComplete?: BookingCompleteData;
}

// ==========================================
// Travel Card Data Types
// ==========================================

export interface FlightOptionData {
  id: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  stopCity?: string;
  price: number;
  currency: string;
}

export interface HotelOptionData {
  id: string;
  name: string;
  image: string;
  stars: number;
  location: string;
  amenities: string[];
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  nights: number;
}

export interface TransferOptionData {
  id: string;
  vehicleType: string;
  image: string;
  duration: string;
  capacity: number;
  luggage: number;
  doors: number;
  fuelType?: string;
  price: number;
  currency: string;
  badge?: {
    text: string;
    type: 'eco' | 'premium' | 'budget';
  };
}

export interface ExperienceOptionData {
  id: string;
  title: string;
  image: string;
  duration: string;
  rating: number;
  reviewCount: number;
  description: string;
  pricePerPerson: number;
  currency: string;
}

export interface TripSummaryData {
  flight: {
    label: string;
    details: string;
    price: number;
  };
  hotel: {
    label: string;
    details: string;
    price: number;
  };
  transfer: {
    label: string;
    details: string;
    price: number;
  };
  experiences: Array<{
    label: string;
    price: number;
  }>;
  currency: string;
  totalPrice: number;
}

export interface BookingConfirmationData {
  tripSummary: TripSummaryData;
}

export interface BookingCompleteData {
  bookingRef: string;
  tripSummary: TripSummaryData;
}
