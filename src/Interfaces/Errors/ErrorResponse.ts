export class ErrorResponse {
    public status: number;
    public message: string;
    public error: string | null;
  
    constructor(status: number, message: string, error: string | null = null) {
      this.status = status;
      this.message = message;
      this.error = error;
    }
  }
  