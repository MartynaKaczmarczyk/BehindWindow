import { NearbyPlace } from '../../travel/models/travel';

export interface SavedStory {
  id: number;
  name: string;
  town: string;
  aiStory: string;
  featuredPlace: NearbyPlace | null;
  createdAt: string;
  updatedAt: string;
}

export type NewSavedStory = Pick<SavedStory, 'name' | 'town' | 'aiStory' | 'featuredPlace'>;

export type SavedStoryUpdate = Partial<Pick<SavedStory, 'name' | 'aiStory'>>;