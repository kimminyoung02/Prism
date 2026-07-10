import { Outlet } from "react-router-dom"
import BottomNav from "./BottomNav"

export default function Layout() {
  return (
    <div className="relative mx-auto min-h-svh w-full max-w-[430px] bg-surface shadow-xl dark:bg-[#0D1B24]">
      <Outlet />
      <BottomNav />
    </div>
  )
}
