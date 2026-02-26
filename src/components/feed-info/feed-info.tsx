import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store/store';
import { feedSlice } from '../../services/feed/slice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(feedSlice.selectors.selectFeedOrders);
  const total = useSelector(feedSlice.selectors.selectFeedTotal);
  const totalToday = useSelector(feedSlice.selectors.selectFeedTotalToday);
  const isLoading = useSelector(feedSlice.selectors.selectFeedLoading);
  const error = useSelector(feedSlice.selectors.selectFeedError);

  const feed = {
    orders,
    total,
    totalToday,
    isLoading,
    error
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
