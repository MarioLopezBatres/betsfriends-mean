export interface Bet {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  private: boolean;
  comments: boolean;
  prize: string;
  participants: string[];
}
