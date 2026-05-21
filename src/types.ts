export interface UserProfile {
  age: string;
  gender: string;
  clothingStyle: string;
  favoriteColor: string;
  musicGenre: string;
  photoUploaded: boolean;
}

export interface FeedEvent {
  songName: string;
  musicGenre: string;
  mood: string;
  tempo: string;
  day: number;
}

export interface PetParts {
  body: string | null;
  accessory: string | null;
  headFeature: string | null;
  patternEffect: string | null;
}

export type AppStep =
  | 'HOME'
  | 'QUESTIONNAIRE'
  | 'PREVIEW'
  | 'FEEDING'
  | 'DAILY_RESULT'
  | 'PROGRESS'
  | 'FINAL'
  | 'RATING'
  | 'INTERVIEW';

export interface AppState {
  step: AppStep;
  profile: UserProfile | null;
  feeds: FeedEvent[];
  petParts: PetParts;
}
