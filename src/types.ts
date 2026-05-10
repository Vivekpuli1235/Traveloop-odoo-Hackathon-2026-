export interface User {
  id: number;
  name: string;
  email: string;
  photo?: string;
  interested_places?: string;
  travel_interests?: string;
  dream_places?: string;
}

export interface Activity {
  id: number;
  stop_id: number;
  name: string;
  description?: string;
  time?: string;
  cost: number;
  category?: string;
}

export interface Stop {
  id: number;
  trip_id: number;
  city_name: string;
  country?: string;
  arrival_date?: string;
  departure_date?: string;
  order_index: number;
  activities: Activity[];
}

export interface Trip {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  cover_photo?: string;
  is_public: boolean;
  budget_flights?: number;
  budget_cabs?: number;
  budget_food?: number;
  budget_accommodation?: number;
  created_at: string;
  stops?: Stop[];
}

export interface ChecklistItem {
  id: number;
  trip_id: number;
  task: string;
  category?: string;
  is_packed: boolean;
}

export interface TripNote {
  id: number;
  trip_id: number;
  content: string;
  note_type: 'text' | 'image' | 'voice';
  stop_id?: number;
  created_at: string;
}

export interface CommunityRating {
  id: number;
  user_id: number;
  reviewer_name?: string;
  location_name: string;
  country_name: string;
  is_india: boolean;
  rating: number;
  review: string;
  image_url?: string;
  created_at: string;
}
