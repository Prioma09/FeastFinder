import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";

function MobileNavLinks() {
  const { logout } = useAuth0();
  return (
    <>
      <Link
        className="flex bg-white items-center font-bold hover:text-orange-500 justify-center"
        to="/orders-status"
      >
        Order Status
      </Link>

      <Link
        to="/manage-restaurant"
        className="font-bold hover:text-orange-500 flex justify-center items-center"
      >
        My Restaurant
      </Link>

      <Link
        className="flex bg-white items-center font-bold hover:text-orange-500 justify-center"
        to="/user-profile"
      >
        User Profile
      </Link>

      <Button
        className="flex item-center px-3 hover:bg-gray-500 font-bold"
        onClick={() => logout()}
      >
        Log out
      </Button>
    </>
  );
}

export default MobileNavLinks;
