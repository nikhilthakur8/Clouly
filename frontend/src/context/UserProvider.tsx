import { useState } from "react";
import { UserContext } from "./context";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<unknown>(null);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
