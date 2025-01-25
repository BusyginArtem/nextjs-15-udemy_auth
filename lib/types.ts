export interface Training {
  id: string;
  title: string;
  image: string;
  description: string;
}

export type RawTrainingData = Omit<Training, "id">;
