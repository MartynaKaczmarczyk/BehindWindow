export interface NearbyPlace {
  title: string;
  distanceMeters: number;
  url: string;
  imageUrl: string | null;
}

export interface ExploreResponse {
  status: 'success';
  town: string;
  aiStory: string;
  featuredPlace: NearbyPlace | null;
  results: NearbyPlace[];
}

export type TravelMode = 'gps' | 'simulation' | null;

export type StoryState =
  | { kind: 'idle' }
  | { kind: 'loading'; message: string }
  | { kind: 'error'; message: string }
  | { kind: 'story'; label: string; data: ExploreResponse };