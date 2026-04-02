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

// Monthly Report (月次レポート)
export interface MonthlyReport {
  id: string;
  reportMonth: string;
  reportType: 'platform' | 'builder';
  builderId?: string;
  metrics: PlatformMetrics | BuilderMetrics;
  generatedAt: string;
}

export interface PlatformMetrics {
  visitors: {
    total: number;
    unique: number;
    byDevice: Record<string, number>;
    bySource: Record<string, number>;
  };
  content: {
    propertyViews: number;
    articleReads: number;
    videoViews: number;
    topProperties: { id: string; title: string; views: number }[];
  };
  engagement: {
    favoritesAdded: number;
    comparisonsCreated: number;
    simulatorUses: number;
    lineClicks: number;
    telClicks: number;
  };
  chat: {
    sessionsStarted: number;
    sessionsCompleted: number;
    completionRate: number;
    toLeadConversions: number;
  };
  leads: {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    conversionRate: number;
  };
  monthOverMonth: {
    visitorsChange: number;
    leadsChange: number;
    chatChange: number;
  };
}

export interface BuilderMetrics {
  builderName: string;
  propertyViews: number;
  topProperties: { id: string; title: string; views: number }[];
  leads: {
    total: number;
    byType: Record<string, number>;
  };
  chatMentions: number;
  favoritesCount: number;
  monthOverMonth: {
    viewsChange: number;
    leadsChange: number;
  };
}
