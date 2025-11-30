export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: Date; 
}
