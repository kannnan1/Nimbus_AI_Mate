
export type SubSection = {
  id: string;
  title: string;
};

export type Section = {
  id: string;
  title: string;
  subsections: SubSection[];
};
