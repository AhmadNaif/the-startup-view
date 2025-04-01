// Custom error types for different scenarios
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, "DATABASE_ERROR", 500);
    this.name = "DatabaseError";
  }
}

// Error handler utility functions
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR");
  }

  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR");
};

// Helper function to format error messages for UI
export const formatErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case "NOT_FOUND":
      return error.message;
    case "DATABASE_ERROR":
      return "An error occurred while accessing the database. Please try again later.";
    default:
      return "Something went wrong. Please try again later.";
  }
};
