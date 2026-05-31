export interface Gratitude {
  _id: string;
  text: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface GratitudeState {
  gratitudes: Gratitude[];
  loading: boolean;
  error: string | null;
}