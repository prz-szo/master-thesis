import type { Component } from 'solid-js';

import { RecommendationsList } from './components';
import { mockProducts } from './mockProducts';

// TODO: Add images
// TODO: Export as a WebComponent

// Optionals:
// TODO: Get data from API

const App: Component = () => {
  return <RecommendationsList items={mockProducts} />;
};

export default App;
