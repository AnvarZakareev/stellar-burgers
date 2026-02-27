import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store/store';
import {
  fetchUserOrders,
  selectProfileOrders,
  selectProfileLoading,
  selectProfileError
} from '../../services/profile/slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    console.error('Ошибка загрузки заказов:', error);
  }

  return <ProfileOrdersUI orders={orders} />;
};
