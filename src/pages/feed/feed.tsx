import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store/store';
import { getFeedOrders, feedSlice } from '../../services/feed/slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(feedSlice.selectors.selectFeedOrders);
  const isLoading = useSelector(feedSlice.selectors.selectFeedLoading);
  const error = useSelector(feedSlice.selectors.selectFeedError);

  useEffect(() => {
    dispatch(getFeedOrders());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeedOrders());
  };

  if (error) {
    return (
      <div className='error'>
        <p>Ошибка загрузки ленты заказов: {error}</p>
        <button onClick={handleGetFeeds}>Попробовать снова</button>
      </div>
    );
  }

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
