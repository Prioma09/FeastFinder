import { useAuth0 } from "@auth0/auth0-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function UsernameMenu() {
  const { user, logout } = useAuth0();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-orange-500 gap-2">
        <CircleUserRound className="text-orange-500" />
        {user?.name}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2 bg-orange-100 z-50">
        <DropdownMenuItem>
          <Link
            to="/manage-restaurant"
            className="font-bold hover:text-orange-500 "
          >
            Manage Restaurant
          </Link>
        </DropdownMenuItem>

        <Separator />

        <DropdownMenuItem>
          <Link to="/user-profile" className="font-bold hover:text-orange-500 ">
            User Profile
          </Link>
        </DropdownMenuItem>

        <Separator />

        <DropdownMenuItem>
          <Button
            className="flex flex-1 font-bold bg-white text-black hover:bg-white hover:text-orange-500"
            onClick={() => logout()}
          >
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UsernameMenu;
