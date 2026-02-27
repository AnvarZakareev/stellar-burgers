import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store/store';
import {
  fetchUserOrders,
  selectProfileOrders,
  selectProfileLoading,
  selectProfileError
} from '../../services/profile/slice';
import { Preloader } from '../../components/ui/preloader/preloader';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  if (error) {
    console.error('Ошибка загрузки заказов:', error);
  }

  return <ProfileOrdersUI orders={orders} />;
};
