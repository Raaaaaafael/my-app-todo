export class TodoItem {
  id: number;
  created_at?: Date;
  updated_at?: Date;
  version?: number;
  created_by_id?: number;
  update_by_id?: number;
  title?: string;
  description?: string;
  is_closed?: boolean;
}
