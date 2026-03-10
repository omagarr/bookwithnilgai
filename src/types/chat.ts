export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: File[];
  isSupersededSummary?: boolean; // Flag for superseded quote summary messages
  isHidden?: boolean; // Flag for messages that should fade in after being rendered
  transferOption?: {
    image: string;
    title: string;
    badge: {
      text: string;
      type: 'eco' | 'premium' | 'budget';
    };
    feature: string;
    fullFeature?: string; // Full description for tooltip
    capacity: number | null;
    luggage: number;
    skis_snowboards: number; // HIDDEN: Currently not displayed in UI - TODO: Remove when bookingUrl supports ski/snowboard parameters
    pricing: {
      total: string;
      perPerson?: string;
      isLimited?: boolean;
    };
    buttonType: 'book' | 'enquire';
    onButtonClick: () => void;
  };
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
} 