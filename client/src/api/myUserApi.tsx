import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type createUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (user: createUserRequest) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.post(`/api/my/user`, user, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("unable to create user");
    }
  };

  const {
    mutateAsync: createUser,
    isPending: isLoading,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: createMyUserRequest,
  });

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
  };
};

type UpdateMyUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.put(`/api/my/user`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("failed to Update user");
    }
  };

  const {
    mutateAsync: updateUser,
    isPending,
    isSuccess,
    error,
    reset,
  } = useMutation({
    mutationFn: updateMyUserRequest,
  });

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }
  return { updateUser, isPending };
};

export const useGetMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.get<User>("/api/my/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("failed to fetch user");
    }
  };

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: getMyUserRequest,
  });

  if (error) {
    toast.error(error.toString());
  }
  return { currentUser, isLoading };
};
