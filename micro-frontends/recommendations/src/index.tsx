/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import './index.css';

render(
  () => <App productId={2} />,
  document.getElementById('root') as HTMLElement
);
