// /api/my/restaurant

import { Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyRestaurant = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.post(
        `/api/my/restaurant`,
        restaurantFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error("failed to create restaurant");
    }
  };

  const {
    mutate: createRestaurant,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: createMyRestaurant,
  });

  if (isSuccess) {
    toast.success("Restaurant created");
  }
  if (error) {
    toast.error("Unable create restaurant");
  }

  return { createRestaurant, isLoading };
};

export const useGetMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const getMyRestaurant = async (): Promise<Restaurant> => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.get(`/api/my/restaurant`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to get restaurant");
    }
  };

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["fetchMyRestaurant"],
    queryFn: getMyRestaurant,
  });

  return { restaurant, isLoading };
};

export const useUpdateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.put(
        `/api/my/restaurant`,
        restaurantFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error("Failed to update restaurant");
    }
  };

  const {
    mutate: updateRestaurant,
    isPending: isLoading,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: updateRestaurantRequest,
  });

  if (isSuccess) {
    toast.success("Restaurant Updated");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { updateRestaurant, isLoading };
};

export const useGetMyRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantOrders = async () => {
    const accessToken = await getAccessTokenSilently();

    try {
      const response = await axios.get(`/api/my/restaurant/order`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Order info not found");
    }
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ["fetchMyRestaurantOrders"],
    queryFn: getMyRestaurantOrders,
  });
  return { orders, isLoading };
};
