import { useAuth } from "../store/AuthContext"
import LoginPage from "./LoginPage"
import MyPage from "./MyPage"

export default function MyTab() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <MyPage /> : <LoginPage />
}
