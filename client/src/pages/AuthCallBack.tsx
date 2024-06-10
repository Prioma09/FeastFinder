import { useCreateMyUser } from "@/api/myUserApi";
import { useAuth0 } from "@auth0/auth0-react";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { createUser } = useCreateMyUser();

  const hasCreatedUser = useRef(false);

  useEffect(() => {
    if (user) {
      if (user?.sub && user?.email && !hasCreatedUser.current) {
        createUser({ auth0Id: user.sub, email: user.email })
          .then(() => {
            hasCreatedUser.current = true;
            navigate("/");
          })
          .catch((error) => {
            console.log("Error creating user:", error);
            navigate("/");
          });
        hasCreatedUser.current = true;
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [createUser, navigate, user]);

  return <>Loading...</>;
};

export default AuthCallbackPage;
