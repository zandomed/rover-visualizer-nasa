import { Filter } from './filter';

export interface FilterSaved {
  filter: Filter;
  createdAt: Date;
  name: string;
}
