export const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
};

export enum Gender {
  MALE = 'MALE',
  GIRL = 'FEMALE',
  OTHER = 'OTHER',
}

export const Environment = {
  Development: 'development',
  Production: 'production',
};

export enum CreateCategoryKind {
  Product = 'product',
  Blog = 'blog',
}

export const TypePermissionCategory = {
  Single: 'SINGLE',
  Multilevel: 'MUlTILEVEL',
};

export const TypeGameDice = {
  XocDia: '0',
  ChanLe: '1',
  Blockchain: '2',
};

export const TypeGameBaccarat = {
  normal: '0',
  flash: '1',
};

export const StatusDiceDetail = {
  prepare: 0,
  shake: 1,
  bet: 2,
  waitOpen: 3,
  check: 4,
  end: 5,
};

export const StatusBaccarat = {
  prepare: 0,
  bet: 1,
  waitOpen: 2,
  showPoker: 3,
  check: 4,
  end: 5,
};

export const TypeAnswerDice = {
  p1: 1,
  p2: 2,
  p3: 3,
  p4: 4,
  p5: 5,
  p6: 6,
  p7: 7,
  p8: 8,
  p9: 9,
  p10: 10,
};

export const TypePlayGameBaccarat = {
  old: 'old',
  all: 'all',
};

export const TypeAnswerBaccarat = {
  p1: 1, //Con đôi
  p2: 2, // Con long bao
  p3: 3, // Hoa
  p4: 4, // Cai
  p5: 5, // Con
  p6: 6, // Super 6
  p7: 7, // Cai doi
  p8: 8, // Cai long bao
};

export const StatusHistoryPlayGame = {
  wait: 0,
  success: 1,
};

export const TypeUpdatePointUser = {
  up: 0,
  down: 1,
};

export const pointPoker = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 0,
  J: 0,
  Q: 0,
  K: 0,
};

export const CodeApiKu6018 = {
  0: 'Thành công',
  1: 'Thiếu Parameter',
  2: 'Sai token',
  3: 'Không tìm thấy thành viên',
  4: 'Lỗi không xác định',
  5: 'Lỗi không đủ số dư',
};

export * from './message';
