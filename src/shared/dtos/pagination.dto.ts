import { FilterDto } from '../../contexts/filterContext';

export interface PaginationDto {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  filter?: Partial<FilterDto>;
}

export interface PaginatedDto<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
}
