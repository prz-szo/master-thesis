import { Button, ChakraProvider } from "@chakra-ui/react";
import { useCallback, useRef } from "react";

interface AddToCartButtonProps {
  id: number;
  quantity?: number;
}

export const AddToCartButton = ({ id, quantity }: AddToCartButtonProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const clickHandler = useCallback(() => {
    ref.current!.dispatchEvent(
      new CustomEvent("cart-old:item_added", {
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