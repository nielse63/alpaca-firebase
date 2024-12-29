export = checkBuyingPower;
declare function checkBuyingPower(): Promise<
  | {
      status: number;
      message: string;
      value: number;
      block?: undefined;
      error?: undefined;
      buying_power?: undefined;
    }
  | {
      status: number;
      message: any;
      block: string;
      error: unknown;
      value?: undefined;
      buying_power?: undefined;
    }
  | {
      buying_power: number;
      status?: undefined;
      message?: undefined;
      value?: undefined;
      block?: undefined;
      error?: undefined;
    }
>;
