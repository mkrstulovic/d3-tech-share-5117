export type PrintHistory = {
  startTime: Date;
  actualPrintTime: number;
  calculatedPrintTime: number;
  status: 'printed' | 'aborted';
};

export type WeeklyPrintCount = {
  weekStart: Date;
  printCount: number;
};
