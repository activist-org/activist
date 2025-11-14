export type InitialEntity<T> = Partial<Omit<T, "id">> & { id: string };

export interface Entity {
  id: string;
  name: string;
  createdBy: User | string;
  creationDate?: string;
}