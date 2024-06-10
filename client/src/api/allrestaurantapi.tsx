// /api/restaurant/search/:city
// /api/restaurant/:restaurantId

import { searchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetRestaurant = (restaurantId?: string) => {
  const getRestaurantById = async (): Promise<Restaurant> => {
    try {
      const response = await axios.get(`/api/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      throw new Error("Unable to fetch restaurant");
    }
  };

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["fetchRestaurant"],
    queryFn: getRestaurantById,
    enabled: !!restaurantId,
  });

  return { restaurant, isLoading };
};

export const useSearchRestaurants = (
  searchState: searchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    try {
      const params = new URLSearchParams();
      params.set("searchQuery", searchState.searchQuery);
      params.set("page", searchState.page.toString());
      params.set("selectedCuisines", searchState.selectedCuisines.join(","));
      params.set("sortOption", searchState.sortOption);

      //
      const response = await axios.get(
        `/api/restaurant/search/${city}?${params.toString()}`
      );
      return response.data;
      console.log(response.data);
    } catch (error) {
      throw new Error("Failed to get restaurant");
    }
  };

  const { data: results, isLoading } = useQuery({
    queryKey: ["searchRestaurant", searchState],
    queryFn: createSearchRequest,
    enabled: !!city,
  });

  return { results, isLoading };
};
