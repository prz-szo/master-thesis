import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

import type { Component } from 'solid-js';
import { RecommendationsList } from './components';

const queryClient = new QueryClient();

// TODO: Export as a WebComponent

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecommendationsList productId={1} />
    </QueryClientProvider>
  );
};

export default App;
