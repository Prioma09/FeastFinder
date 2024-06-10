import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";

import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/myUserApi";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type Props = {
  onCheckOut: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

function CheckOutButton({ onCheckOut, disabled, isLoading }: Props) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();

  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const { pathname } = useLocation();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <Button className="bg-orange-500 flex-1" onClick={onLogin}>
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 flex-1" disabled={disabled}>
          Go to checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <UserProfileForm
          currentUser={currentUser}
          onSave={onCheckOut}
          isLoading={isGetUserLoading}
          buttonText="Continue to payment"
          title={"Confirm Deliery Details"}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CheckOutButton;
