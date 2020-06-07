import React from "react";
import Cookies from "js-cookie";

type User = {
  id: string;
  teamId: string;
  token: string;
};

type UserContext = {
  user: User | null;
  signOut: () => void;
};

export const UserContext = React.createContext<UserContext>({
  user: null,
  signOut: () => {
    throw new Error("signOut() not implemented");
  },
});

const userReducer = (state, action) => ({ ...state, ...action });

const AuthProvider = ({ children }) => {
  const [{ user }, dispatch] = React.useReducer(userReducer, {});

  const setUser = ({ id, teamId, token }: User) =>
    dispatch({ user: { id, teamId, token } });

  const signOut = () => dispatch({ user: null });

  React.useEffect(() => {
    if (Cookies.get("su")) {
      const userCookie = JSON.parse(Cookies.get("su"));

      setUser({
        id: userCookie.user_id,
        teamId: userCookie.team_id,
        token: userCookie.access_token,
      });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useAuth = () => {
  const { user, signOut } = React.useContext(UserContext);

  return { user, signOut };
};

export { AuthProvider, useAuth };
