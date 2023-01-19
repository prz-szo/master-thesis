/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import { AddToCartButton } from './AddToCartButton';

const WebAddToCartComponent = reactToWebComponent(
  AddToCartButton,
  // @ts-ignore
  React,
  ReactDOM
);

// @ts-ignore
customElements.define('add-to-cart-btn', WebAddToCartComponent);
