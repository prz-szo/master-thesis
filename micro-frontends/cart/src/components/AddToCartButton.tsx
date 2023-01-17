import { Button, ChakraProvider } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';

interface AddToCartButtonProps {
  id: number;
  quantity?: number;
}

export const AddToCartButton = ({ id, quantity }: AddToCartButtonProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const clickHandler = useCallback(() => {
    ref.current!.dispatchEvent(
      new CustomEvent('cart:item_added', {
        bubbles: true,
        detail: { id, quantity: quantity ?? 1 },
      })
    );
  }, [id, quantity]);

  return (
    <ChakraProvider>
      <div className="w-full" ref={ref}>
        <Button
          colorScheme="teal"
          size="lg"
          width="100%"
          onClick={clickHandler}
        >
          Add to Cart
        </Button>
      </div>
    </ChakraProvider>
  );
};

AddToCartButton.propTypes = {
  id: PropTypes.number.isRequired,
  quantity: PropTypes.number,
};

const WebAddToCartComponent = reactToWebComponent(
  AddToCartButton,
  // @ts-ignore
  React,
  ReactDOM
);

// @ts-ignore
customElements.define('add-to-cart-btn', WebAddToCartComponent);
