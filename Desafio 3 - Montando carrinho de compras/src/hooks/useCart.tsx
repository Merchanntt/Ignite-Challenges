import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const cartItem = cart.find(item => item.id === productId)

      if(!cartItem) {
        const { data } = await api.get<Product[]>('/products', {
          params: {
            id: productId
          }
        })

        if(!data) {
          throw new Error()
        }

        const addItem = data.map(item => ({
          ...item,
          amount: 1,
        }))[0];

        const newCartArray = [...cart, addItem]
        setCart(newCartArray)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCartArray))
      } 

      if(cartItem) {
        const productIncrement = {
          productId: cartItem.id,
          amount: cartItem.amount += 1
        }

        await updateProductAmount(productIncrement)
      }

    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const findCartIndex = cart.findIndex(item => item.id === productId);

      if(findCartIndex < 0) {
        throw new Error()
      }
      
      const updatedCart = cart.filter(item => item.id !== productId)

      setCart(updatedCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const { data } = await api.get<Stock[]>('/stock', {
          params: {
            id: productId
          }
        })

      const amountAvailable = data[0]
        console.log(amount)
      if(amountAvailable.amount <= amount) {
        
        throw new Error()
      }

      const findItem = cart.map(item => productId === item.id ? {
        ...item,
        amount
      }: item)

      setCart(findItem)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(findItem))
    } catch {
      toast.error('Quantidade solicitada fora de estoque')
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
