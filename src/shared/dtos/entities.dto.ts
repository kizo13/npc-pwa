import AgeEnums from '../enums/age.enum';
import CultureEnums from '../enums/culture.enums';
import GenderEnums from '../enums/gender.enum';

export interface AvatarDto {
  id: number;
  blob: string;
  createdAt: Date;
  uploader: UserDto;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  avatar: AvatarDto;
}

export interface NpcDto {
  id: number;
  blob: string;
  gender: GenderEnums;
  class: string[];
  age: AgeEnums;
  race: string;
  culture: CultureEnums;
  uploader: UserDto;
  createdAt: Date;
  modifiedAt: Date;
}
