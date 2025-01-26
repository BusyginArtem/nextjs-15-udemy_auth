declare const __brand__type__: unique symbol;

type Brand<BaseType, BrandName> = BaseType & {
  readonly [__brand__type__]: BrandName;
};

// export const unbrand = <T>(value: T): T extends Brand<infer U, any> ? U : T =>
//   value as any;

export type UserId = Brand<number | bigint, "USER_ID">;
export type TrainingId = Brand<string, "TRAINING_ID">;

export interface Training {
  id: TrainingId;
  title: string;
  image: string;
  description: string;
}

export interface User {
  id: UserId;
  email: string;
  password: string;
}

export type RawTrainingData = Omit<Training, "id">;

export type FormMode = "login" | "signup";
