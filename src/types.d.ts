export type Quota = {
    user: string;
    appointment?: "UGRD"|"GRAD"|"PROF"|"STAFF";
    unit?: string;
    usage: number;
    limit: number;
    remaining: number;
    // percent: number;
}

export type PrintHistory = {
    startTime: Date;
    printer: string;
    user: string;
    actualPrintTime: number;
    calculatedPrintTime: number;
    status: "printed"|"aborted";
    filamentUsed: number;
    costs: number;
    notes?: string;
}