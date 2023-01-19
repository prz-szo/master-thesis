import { Button, ChakraProvider } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
}

export const AddToCartButton = ({
  productId,
  quantity,
}: AddToCartButtonProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const clickHandler = useCallback(() => {
    ref.current!.dispatchEvent(
      new CustomEvent('cart:item_added', {
        bubbles: true,
        detail: {
          productId: Number(productId),
          quantity: Number(quantity ?? 1),
        },
      })
    );
  }, [productId, quantity]);

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
  productId: PropTypes.number.isRequired,
  quantity: PropTypes.number,
};
