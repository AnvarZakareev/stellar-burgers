import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store/store';
import { setOrderRequest, setOrderModalData } from '../../services/order/slice';
import { addBun, clearConstructor } from '../../services/constructor/slice';
import { orderBurgerApi } from '../../utils/burger-api';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/constructor' } });
      return;
    }

    createOrder();
  };

  const createOrder = async () => {
    dispatch(setOrderRequest(true));

    try {
      const ingredients = [
        constructorItems.bun!._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun!._id
      ];

      const orderData = await orderBurgerApi(ingredients);

      const orderForModal = {
        _id: `order_${orderData.order.number}`,
        status: 'done' as const,
        name: orderData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderData.order.number,
        ingredients: ingredients
      };

      dispatch(clearConstructor());

      dispatch(setOrderRequest(false));
      dispatch(setOrderModalData(orderForModal));
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      dispatch(setOrderRequest(false));
    }
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
