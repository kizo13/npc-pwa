import AgeEnums from '../enums/age.enum';
import CultureEnums from '../enums/culture.enums';
import GenderEnums from '../enums/gender.enum';
import RaceEnums from '../enums/race.enums';

export interface CreateNpcDto {
  file: File | undefined;
  gender?: GenderEnums;
  class: string[];
  age?: AgeEnums;
  race?: RaceEnums;
  culture?: CultureEnums;
}

export interface UpdateNpcDto {
  gender?: GenderEnums;
  class?: string[];
  age?: AgeEnums;
  race?: RaceEnums;
  culture?: CultureEnums;
}

export interface NameGeneratorFilter {
  gender: GenderEnums;
  culture: CultureEnums;
}
