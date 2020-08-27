import * as React from 'react';
import classNames from "classnames";
import {GoodItem, GoodItems} from "../../types/good-item-type";
import {MouseEnding, PortionEnding} from "../../js/enums";
import {setEndingWords} from "../../js/utils";

type GoodItemsProps = {
  data: GoodItems;
};

type GoodItemProps = {
  elem: GoodItem;
};

interface State {
  status: string;
  hoverStatus: boolean;
  src: null | string;
}

const GoodsItems: React.FC<GoodItemsProps> = ({data}: GoodItemsProps) => {
  return (
    <ul className="goods__list">

      { data.length > 0 &&
        data.map(elem =>
        <GoodsItem
          // properties
          key={elem.id}
          elem={elem}
        />
      )}

    </ul>
  );
};

class GoodsItem extends React.PureComponent<GoodItemProps, State> {
  state = {
    status: this.props.elem.status,
    hoverStatus: false,
    src: null,
  }

  componentDidMount() {
    const {src} = this.props.elem;

    this.loadImage(src);
  }

  loadImage(filename) {
    import(`@/assets/images/${filename}`)
      .then(image => {
        this.setState({
          src: image.default,
        })
      })
  }

  render() {
    const {content, portionsAmount, mouseAmount, weight, activeDescription} = this.props.elem;
    const {status, hoverStatus, src} = this.state;

    const goodItemClass = classNames({
      'goods__item': true,
      'default-item': status === 'default',
      'active-item': status === 'active',
      'disable-item': status === 'disabled',
      "active-item-hover": status === 'active' && hoverStatus,
    });

    const handleItemClick = (evt) => {
      evt.preventDefault();

      if (status === 'disabled') return false;

      (status === 'default') ?
        this.setState({
          status: 'active',
        }) :
        this.setState({
          status: 'default',
        });

      this.setState({
        hoverStatus: false,
      });
    };

    const handleItemMouseenter = () => {
      this.setState({
        hoverStatus: true,
      });
    };

    const handleItemMouseleave = () => {
      this.setState({
        hoverStatus: false,
      });
    };

    const setArticleDescription = () => {
      let description;

      switch(status) {
        case 'active':
          description = <p className="goods__article-description">{activeDescription}</p>
          break;
        default:
          description = <p className="goods__article-description">Чего сидишь? Порадуй котэ, <span onClick={handleItemClick}>купи.</span></p>
          break;
      }

      return description;
    };

    return (
      <li className={goodItemClass}>
        <div className="goods__inner-wrapper" onMouseEnter={handleItemMouseenter} onMouseLeave={handleItemMouseleave}>
          <article className="goods__article" onClick={handleItemClick}>
            <div className="goods__title-wrapper">
              <h2 className="goods__subtitle"><span>Нямушка</span>с {content}</h2>

              { (status === 'active' && hoverStatus) ?
                <p className="goods__description goods__description--first">Котэ не одобряет?</p> :
                <p className="goods__description goods__description--first">Сказочное заморское яство</p>
              }

              <p className="goods__description"><span>{portionsAmount}</span> {setEndingWords(portionsAmount, PortionEnding)}</p>
              <p className="goods__description goods__description__mouse">
                { mouseAmount !== 1 &&
                  <span>{mouseAmount} </span>
                }

                {setEndingWords(mouseAmount, MouseEnding)} в подарок
              </p>

              { mouseAmount >= 5 &&
                <p className="goods__description">заказчик доволен</p>
              }
            </div>

            <div className="goods__image-wrapper">
              { src &&
                <img className="goods__image" src={src} width={370} height={361} alt="Cat" />
              }
            </div>


            <span className="goods__price">{weight} <span onClick={handleItemClick}>кг</span></span>
          </article>

          { status === 'disabled'
            ? <p className="goods__article-description">Печалька, с {content} закончился.</p>
            : setArticleDescription()
          }

        </div>
      </li>
    )
  }
}

export default GoodsItems;
