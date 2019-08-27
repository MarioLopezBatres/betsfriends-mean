export interface Bet {
  id: string;
  title: string;
  imagePath: string;
  description: string;
  startDate: Date;
  endDate: Date;
  private: boolean;
  prize: string;
  participants: string[];
}
