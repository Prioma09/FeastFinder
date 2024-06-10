import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useUpdateMyRestaurant,
} from "@/api/myrestaurant";
import ManageRestaurantForm from "@/forms/restaurant-form/ManageRestaurantForm";

function ManageRestaurantPage() {
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateMyRestaurant();

  const { restaurant } = useGetMyRestaurant();

  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateMyRestaurant();

  const isEditing = !!restaurant;

  return (
    <ManageRestaurantForm
      onSave={isEditing ? updateRestaurant : createRestaurant}
      restaurant={restaurant}
      isLoading={isCreateLoading || isUpdateLoading}
    />
  );
}

export default ManageRestaurantPage;
