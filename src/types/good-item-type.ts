type GoodItem = {
  id: number;
  content: string;
  portionsAmount: number;
  mouseAmount: number;
  weight: string;
  activeDescription: string;
  src: string;
  status: string;
};

type GoodItems = GoodItem[];

export {GoodItem, GoodItems};
