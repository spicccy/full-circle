export interface IClient {
  id: string;
  sessionId: string;
  close: (code?: number | undefined, data?: string | undefined) => void;
}
