export type UpdatedRow = {
  original: Record<string, unknown>;
  value: {
    column: string;
    value: unknown;
  };
};