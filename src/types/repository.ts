/**
 * Repository 패턴 관련 타입 정의
 */

export interface IRepository<T> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, updates: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor?: number;
  hasMore: boolean;
}

export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}
