import * as React from 'react';
import {GoodItems} from "../../types/good-item-type";
import GoodsItems from "../../components/goods-items/goods-items";

type Props = {
  data: GoodItems;
};

const App: React.FC<Props> = ({data}: Props) => {
  return (
    <section className="goods">
      <div className="site-wrapper">
        <h1 className="goods__title">Ты сегодня покормил кота?</h1>

        <GoodsItems
          // properties
          data={data}
        />

      </div>
    </section>
  );
};

export default App;
