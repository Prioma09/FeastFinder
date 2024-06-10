import MenuItem from "@/components/MenuItemCard";
import RestaurantResultInfo from "@/components/RestaurantResultInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Card, CardFooter } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { MenuItem as MenuItemType } from "../types";
import OrderSummery from "@/components/OrderSummery";
import { useGetRestaurant } from "@/api/allrestaurantapi";
import CheckOutButton from "@/components/CheckOutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import Map from "@/components/Map";
import { useCreateCheckoutSession } from "@/api/orderApi";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

function DetailPage() {
  const { restaurantId } = useParams();

  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { creatCheckoutSession, isLoading: isCheckoutLoading } =
    useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems?.filter(
        (item) => cartItem._id !== item._id
      );

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );
      return updatedCartItems;
    });
  };

  if (isLoading || !restaurant) {
    return (
      <div className="flex justify-center items-center ">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
      </div>
    );
  }

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      return;
    }

    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
      },
    };

    const data = await creatCheckoutSession(checkoutData);
    window.location.href = data.url;
  };

  return (
    <div className="flex flex-col gap-20 ">
      <AspectRatio ratio={20 / 5}>
        <img
          src={restaurant.imageUrl}
          className="rounded-md h-full mx-auto w-10/12 object-cover -z-0"
        />
      </AspectRatio>

      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantResultInfo restaurant={restaurant} />
          <span className="text-xxl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
              key={menuItem._id}
            />
          ))}
        </div>
        <div>
          <Card>
            <OrderSummery
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckOutButton
                disabled={cartItems.length === 0}
                onCheckOut={onCheckout}
                isLoading={isCheckoutLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="h-full" id="map">
        <Map />
      </div>
    </div>
  );
}

export default DetailPage;
