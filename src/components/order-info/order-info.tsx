import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store/store';
import { orderSlice } from '../../services/order/slice';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(orderSlice.selectors.selectCurrentOrder);
  const loading = useSelector(orderSlice.selectors.selectLoading);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (number) {
      dispatch(orderSlice.actions.setLoading(true));
      getOrderByNumberApi(Number(number))
        .then((response) => {
          if (response.success && response.orders.length > 0) {
            dispatch(orderSlice.actions.setCurrentOrder(response.orders[0]));
          }
        })
        .catch((error) => {
          console.error('Failed to fetch order:', error);
        })
        .finally(() => {
          dispatch(orderSlice.actions.setLoading(false));
        });
    }
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
