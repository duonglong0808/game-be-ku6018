export interface DataJobCalcPointDice {
  diceDetailId: number;
  transactionId: number;
  totalRed: number;
}

export interface DataJobCalcPointBaccarat {
  baccaratDetailId: number;
  pokerPlayer: string[];
  pokerBanker: string[];
  pointPlayer: number;
  pointBanker: number;
  // transactionId: number;
}

export interface DataJobAddPointToUser {
  userId: number;
  gamePointId: number;
  points: number;
  type: number;
}

export interface DataJobAutoUpdateStatusDice {
  diceDetailId: number;
}

export interface DataJobAutoUpdateStatusBaccarat {
  baccaratDetailId: number;
}
