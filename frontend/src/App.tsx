import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import SearchPage from "./pages/SearchPage"
import CollectingPage from "./pages/CollectingPage"
import AnalyzingPage from "./pages/AnalyzingPage"
import ResultPage from "./pages/ResultPage"
import ReviewsPage from "./pages/ReviewsPage"
import FavoritesPage from "./pages/FavoritesPage"
import MyTab from "./pages/MyTab"
import EditProfilePage from "./pages/EditProfilePage"
import ProductHistoryPage from "./pages/ProductHistoryPage"
import NotificationSettingsPage from "./pages/NotificationSettingsPage"
import SettingsPage from "./pages/SettingsPage"
import SearchTermsListPage from "./pages/SearchTermsListPage"
import SignupPage from "./pages/SignupPage"
import { myReviews, recentlyViewed } from "./mock/data"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/collecting" element={<CollectingPage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/my" element={<MyTab />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route
          path="/my/reviews"
          element={<ProductHistoryPage title="나의 리뷰 기록" items={myReviews} emptyText="아직 분석한 리뷰가 없어요" />}
        />
        <Route
          path="/my/recent"
          element={<ProductHistoryPage title="최근 본 제품" items={recentlyViewed} emptyText="최근 본 제품이 없어요" />}
        />
        <Route path="/my/notifications" element={<NotificationSettingsPage />} />
        <Route path="/my/settings" element={<SettingsPage />} />
        <Route path="/search-terms/recent" element={<SearchTermsListPage variant="recent" />} />
        <Route path="/search-terms/popular" element={<SearchTermsListPage variant="popular" />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  )
}

export default App
