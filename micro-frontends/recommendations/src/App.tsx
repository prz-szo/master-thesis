import type { Component } from "solid-js";

import { RecommendationsList } from "./components";
import { mockProducts } from "./mockProducts";

// TODO: Get data from API
// TODO: Add images
// TODO: Export as a WebComponent

const App: Component = () => {
  return <RecommendationsList items={mockProducts} />;
};

export default App;
