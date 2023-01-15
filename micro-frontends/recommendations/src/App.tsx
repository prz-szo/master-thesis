import type { Component } from 'solid-js';

import { RecommendationsList } from './components';
import { mockProducts } from './mockProducts';

// TODO: Export as a WebComponent
// TODO: API Call to get recommendations

const App: Component = () => {
  return <RecommendationsList items={mockProducts} />;
};

export default App;
