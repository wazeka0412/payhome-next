// Property (物件データ)
export interface Property {
  id: string;
  title: string;
  youtubeId: string;
  viewCount: number;
  publishedAt: string;
  // Pricing
  buildingPrice: number;
  landPrice: number;
  miscCosts: number;
  totalPrice: number;
  pricePerTsubo: number;
  // Specs
  layout: string; // e.g. "3LDK"
  floorArea: number; // tsubo
  siteArea: number; // tsubo
  buildingCoverageRatio: number;
  floorAreaRatio: number;
  // Land
  terrain: 'flat' | 'slope' | 'other';
  roadAccess: string;
  zoning: string;
  landCategory: string;
  buildingConditions: boolean;
  landRights: 'ownership' | 'leasehold';
  // Equipment
  kitchen: { maker: string; series: string };
  bathroom: { maker: string; size: string };
  toilet: { maker: string; series: string };
  // Performance
  insulationGrade: number;
  uaValue: number;
  cValue?: number;
  earthquakeGrade: number;
  ventilation: string;
  solarPower?: number;
  batteryStorage?: boolean;
  monthlyUtility?: number;
  // Builder
  builderId: string;
  // Content
  points: string[];
  faq: { question: string; answer: string }[];
  // Area
  prefecture: string;
  city: string;
  region: 'kyushu' | 'kanto' | 'kansai' | 'chubu' | 'chugoku_shikoku' | 'tohoku' | 'hokkaido';
  // Status
  dataAccuracy: 'estimate' | 'confirmed';
  isPublished: boolean;
}

// Builder (工務店データ)
export interface Builder {
  id: string;
  name: string;
  address: string;
  serviceArea: string[];
  established?: number;
  annualBuilds?: number;
  specialties: string[];
  website?: string;
  description?: string;
  logoUrl?: string;
  plan: 'free' | 'standard' | 'growth' | 'premium';
  createdAt: string;
}

// Lead (リードデータ)
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  area: string;
  buildArea?: string;
  budget?: string;
  layout?: string;
  interestedVideo?: string;
  message?: string;
  source: 'consultation' | 'catalog' | 'event' | 'line' | 'phone';
  status: 'new' | 'contacted' | 'hearing' | 'introduced' | 'meeting' | 'contracted' | 'lost';
  assignedBuilderId?: string;
  createdAt: string;
  updatedAt: string;
}

// Event (見学会データ)
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  builderId: string;
  type: 'completion' | 'model' | 'special' | 'online';
  capacity: number;
  reservations: number;
  isPublished: boolean;
}

// ChatMessage
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  propertyIds?: string[];
}
