export class OrderUpdateError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'OrderUpdateError';
  }
}
