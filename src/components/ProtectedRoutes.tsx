import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Login from "./Login";

const Protected = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return <Login />;
  }
  return <>{children}</>;
};

export default Protected;
