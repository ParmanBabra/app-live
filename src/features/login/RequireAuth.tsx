import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../../app/store";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useSelector((state: RootState) => state.user);
  let location = useLocation();

  if (!user.isLogin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
