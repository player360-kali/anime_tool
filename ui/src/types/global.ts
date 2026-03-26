export interface SliderTypes {
  date: Date;
  _id: string;
  serial: SerialTypes;
  __v: number;
}
export interface LangTypes {
  uz: string;
  ru: string;
}

export interface CategoryTypes {
  _id: string;
  isRestricted: boolean;
  nameuz: string;
  nameru: string;
  createdAt: Date;
  __v: number;
}

export interface SerialTypes {
  _id: string;
  name: LangTypes;
  description: LangTypes;
  screens: {
    thumb: string[];
    original: string[];
  };
  category: CategoryTypes[];
  image: string;
  year: string;
}

export interface SearchType {
  _id: string;
  name: LangTypes;
  category: CategoryTypes[];
  image: string;
}

export interface CardType {
  _id: string;
  name: LangTypes;
  image: string;
  category: CategoryTypes[];
  janr: string[];
  rating: number;
  type: number;
  view: number;
  price: "free" | "selling";
  year: number;
  date: Date;
}

export interface PaginationTypes {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnimeType {
  _id: string;
  name: LangTypes;
  description: LangTypes;
  screens: { thumb: string[]; original: string[] };
  category: CategoryTypes[];
  translator: TranslatorType[];
  tarjimon: TranslatorType[];
  janr: JanrTypes[];
  rating: number;
  tags: string[];
  type: number;
  view: number;
  tip: string;
  date: Date;
  status: boolean;
  num: string;
  video: string;
  url: string;
  rejissor: string;
  length: string;
  studia: string;
  image: string;
  price: "free" | "selling";
  year: string;
  country: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface SeriaTypes {
  _id: string;
  name: LangTypes;
  status: string;
  season: string;
  video: string;
  url: string;
  length: string;
  slug: string;
  premery: Date;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface LikeCountType {
  countLike: number;
  countDislike: number;
}

export interface CommentType {
  _id: string;
  status: boolean;
  likesCount: LikeCountType;
  message: string;
  season: string;
  user: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserType {
  _id: string;
  uid: number;
  name: string;
  photo: string;
  phone: string;
  password: string;
  role: string;
  status: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  __v: number;
}

export interface TranslatorType {
  _id: string;
  name: string;
  image: string;
  status: boolean;
  createdDate: Date;
  __v: number;
}

export interface JanrTypes {
  _id: string;
  status: boolean;
  nameuz: string;
  nameru: string;
  createdAt: Date;
  __v: number;
}
