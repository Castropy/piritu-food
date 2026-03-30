

export type RatingTargetType = 'negocio' | 'cliente';

export interface Rating {
  id?: string;
  author_id: string;
  created_at: Date;
  is_visible: boolean;
  order_id: string;
  rate: number;
  tags: string[];
  target_id: string;
  target_type: RatingTargetType;
}