import { useRouter } from "next/router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { endpoint } from "../constants/api";

type User = {
  name: string;
  email: string;
  picture: string;
  token: string;
};

type AuthContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  signOut: () => void;
  signIn: (token: string) => void;
};

export const AuthContext = createContext<null | AuthContextValue>(null);

// create Provider for auth via oauth
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  // retrieve from local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      signIn(token);
    }
  }, []);

  //   useEffect(() => {
  //     if (user?.token) {
  //       checkToken(user.token);
  //     }
  //   }, [user]);

  //   // check github access token function
  //   const checkToken = (token: string) => {
  //     fetch(
  //       `https://api.github.com/applications/${process.env.NEXT_PUBLIC_OAUTH_APP_CLIENT_ID}/token`,
  //       {
  //         headers: {
  //           accept: "application/vnd.github+json",
  //           method: "POST",
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res) => {
  //         console.log("checking token", res);
  //         if (res.message === "Bad credentials") {
  //           signOut();
  //         }
  //       });
  //   };

  const signIn = async (token: string) => {
    if (!user && token) {
      try {
        const res = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: "token " + token,
          },
        });

        if (res.status === 200) {
          const data = await res.json();
          console.error("Failed to fetch user");
          setUser({
            name: data.name,
            email: data.email,
            picture: data.avatar_url,
            token: token,
          });
          localStorage.setItem("token", token);
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
        console.error("Failed to fetch user", error);
      }
    }
  };

  // revoke token function
  const signOut = () => {
    if (user?.token) {
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// create hook for useAuth

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const useAuthenticatedPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/create`);
    }
  }, [router, user]);
};
