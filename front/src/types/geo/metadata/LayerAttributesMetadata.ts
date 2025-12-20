export interface LayerAttributesMetadata {
  enum?: string[];
  range?: {
    minDate?: Date;
    maxDate?: Date;
    minNumber?: number;
    maxNumber?: number;
  };
  hidden?: boolean;
}
