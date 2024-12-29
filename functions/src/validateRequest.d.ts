export = validateRequest;
declare function validateRequest(req: any): Promise<
  | {
      status: number;
      message: string;
      symbol?: undefined;
      side?: undefined;
    }
  | {
      symbol: any;
      side: any;
      status?: undefined;
      message?: undefined;
    }
>;
