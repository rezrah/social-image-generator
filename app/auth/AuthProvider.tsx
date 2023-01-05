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
  authEnabled?: boolean;
};

export const AuthContext = createContext<null | AuthContextValue>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const authEnabled = process.env.NEXT_PUBLIC_FEATURE_FLAG_AUTH_ENABLED;

  // retrieve from local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      signIn(token);
    }
  }, []);

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
    <AuthContext.Provider
      value={{ user, setUser, signOut, signIn, authEnabled }}
    >
      {children}
    </AuthContext.Provider>
  );
};

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
