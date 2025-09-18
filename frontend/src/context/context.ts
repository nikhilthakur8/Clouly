import { createContext, useContext } from "react";

type User = {
	_id: string;
	email: string;
	name: string;
	picture: string;
	role: "user" | "admin" | string;
	createdAt: string;
	updatedAt: string;
};

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUserContext must be used within a UserProvider");
	}
	return context;
};

export { UserContext, useUserContext };	export type { User };

