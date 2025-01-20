export type Dir = {
  id: number;
  subject: string;
  user: number;
};

export type DirFile = {
  created_at: string;
  directory: number;
  file: string;
  id: number;
  name: string;
};
