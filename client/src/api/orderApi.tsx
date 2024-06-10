import { Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type checkoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: checkoutSessionRequest
  ) => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.post(
        `/api/order/checkout/create-checkout-session`,
        checkoutSessionRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Unable to create checkout session");
    }
  };

  const {
    mutateAsync: creatCheckoutSession,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: createCheckoutSessionRequest,
  });
  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    creatCheckoutSession,
    isLoading,
  };
};

export const useGetMyOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.get(`/api/order`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get orders");
    }
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ["fetchMyOrders"],
    queryFn: getMyOrdersRequest,
    refetchInterval: 5000,
  });
  return { orders, isLoading };
};
