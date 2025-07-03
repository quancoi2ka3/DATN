'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import PersonalRecommendationsWrapper from './PersonalRecommendationsWrapper';

interface PersonalRecommendationsProviderProps {
  count?: number;
  title?: string;
}

export default function PersonalRecommendationsProvider({ 
  count = 4, 
  title = "Sản phẩm phù hợp với bạn" 
}: PersonalRecommendationsProviderProps) {
  return (
    <Provider store={store}>
      <PersonalRecommendationsWrapper count={count} title={title} />
    </Provider>
  );
}
