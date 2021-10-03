import AgeEnums from '../enums/age.enum';
import CultureEnums from '../enums/culture.enums';
import GenderEnums from '../enums/gender.enum';
import RaceEnums from '../enums/race.enums';

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
  race: RaceEnums;
  culture: CultureEnums;
  uploader: UserDto;
  createdAt: Date;
  modifiedAt: Date;
  noteCount: number;
}

export interface NoteDto {
  id: number;
  npc: NpcDto;
  name: string;
  description: string;
  createdBy: UserDto;
  modifiedBy: UserDto;
  createdAt: Date;
  modifiedAt: Date;
}
