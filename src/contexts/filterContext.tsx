import { createContext, useContext } from 'react';
import GenderEnums from '../shared/enums/gender.enum';

export interface FilterDto {
  gender: GenderEnums | null;
  class: string;
  age: string;
  race: string;
  culture: string;
  uploaderId: number | '';
  description: string;
  name: string;
}

export type NpcFilterDto = Pick<FilterDto, 'gender' | 'class' | 'age' | 'race' | 'culture' | 'uploaderId'>;
export type NoteFilterDto = FilterDto;

interface FilterContextInitialStateDto {
  filter: FilterDto;
  setFilter: React.Dispatch<React.SetStateAction<FilterDto>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const initialFilterState: FilterDto = {
  gender: null,
  class: '',
  age: '',
  race: '',
  culture: '',
  uploaderId: '',
  name: '',
  description: '',
};

export const FilterContext = createContext<FilterContextInitialStateDto>({
  filter: initialFilterState,
  setFilter: () => {},
  open: false,
  setOpen: () => {},
});

export const useFilterContext = (): FilterContextInitialStateDto => {
  const filterContext = useContext(FilterContext);
  if (!filterContext) {
    throw new Error('useFilterContext must be used within the useFilterContext.Provider');
  }
  return filterContext;
};
