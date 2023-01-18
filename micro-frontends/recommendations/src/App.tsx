import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { customElement } from 'solid-element';
import type { Component } from 'solid-js';

import { RecommendationsList, Styles } from './components';

import './index.css';

import { Product } from './types';

const queryClient = new QueryClient();

export const WebComponentTagName = 'recommendations-list';

const App: Component<{ productId: Product['id'] }> = (props) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RecommendationsList productId={props.productId} />
      </QueryClientProvider>
      <Styles />
    </>
  );
};

customElement(WebComponentTagName, { productId: 0 }, App);

export default App;
