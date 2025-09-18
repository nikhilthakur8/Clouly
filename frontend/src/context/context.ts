import { createContext, useContext } from "react";

interface UserContextType {
	user: unknown;
	setUser: (user: unknown) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUserContext = () => useContext(UserContext);

export { UserContext, useUserContext };
