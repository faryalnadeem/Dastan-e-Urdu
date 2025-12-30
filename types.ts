
export type Genre = 'Romance' | 'Mystery' | 'Social' | 'Historical' | 'Action' | 'Classic';

export interface Novel {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  coverImage: string;
  description: string;
  content: string[]; // Array of paragraphs/pages
  rating: number;
  publishedDate: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
