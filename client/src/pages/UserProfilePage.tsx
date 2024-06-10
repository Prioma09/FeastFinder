import { useGetMyUser, useUpdateMyUser } from "@/api/myUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";
import { ReloadIcon } from "@radix-ui/react-icons";

function UserProfilePage() {
  const { updateUser, isPending } = useUpdateMyUser();
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();

  if (isGetLoading) {
    return (
      <div className="flex justify-center items-center">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
      </div>
    );
  }

  if (!currentUser) {
    return <span>Unable load user profile</span>;
  }

  return (
    <UserProfileForm
      onSave={updateUser}
      isLoading={isPending}
      currentUser={currentUser}
    />
  );
}

export default UserProfilePage;
