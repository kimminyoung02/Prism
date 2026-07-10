import { Outlet, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import SearchPage from "./pages/SearchPage"
import CollectingPage from "./pages/CollectingPage"
import AnalyzingPage from "./pages/AnalyzingPage"
import ResultPage from "./pages/ResultPage"
import FavoritesPage from "./pages/FavoritesPage"
import MyTab from "./pages/MyTab"
import EditProfilePage from "./pages/EditProfilePage"
import ProductHistoryPage from "./pages/ProductHistoryPage"
import NotificationSettingsPage from "./pages/NotificationSettingsPage"
import SettingsPage from "./pages/SettingsPage"
import ChangePasswordPage from "./pages/ChangePasswordPage"
import SearchTermsListPage from "./pages/SearchTermsListPage"
import SignupPage from "./pages/SignupPage"
import PrismLensPage from "./pages/PrismLensPage"
import LensAnalyzingPage from "./pages/LensAnalyzingPage"
import LensResultPage from "./pages/LensResultPage"
import LegalPage from "./pages/LegalPage"
import CommunityPage from "./pages/CommunityPage"
import CommunityWritePage from "./pages/CommunityWritePage"
import CommunityPostDetailPage from "./pages/CommunityPostDetailPage"
import { termsOfServiceText, privacyPolicyText } from "./mock/data"
import { useActivity } from "./store/ActivityContext"

function LensLayout() {
  return (
    <div className="mx-auto w-full max-w-[430px]">
      <Outlet />
    </div>
  )
}

function App() {
  const { viewedProducts } = useActivity()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/collecting" element={<CollectingPage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/write" element={<CommunityWritePage />} />
        <Route path="/community/post" element={<CommunityPostDetailPage />} />
        <Route path="/my" element={<MyTab />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route
          path="/my/reviews"
          element={<ProductHistoryPage title="나의 리뷰 기록" items={viewedProducts} emptyText="아직 분석한 리뷰가 없어요" />}
        />
        <Route
          path="/my/recent"
          element={<ProductHistoryPage title="최근 본 제품" items={viewedProducts} emptyText="최근 본 제품이 없어요" />}
        />
        <Route path="/my/notifications" element={<NotificationSettingsPage />} />
        <Route path="/my/settings" element={<SettingsPage />} />
        <Route path="/my/settings/password" element={<ChangePasswordPage />} />
        <Route path="/search-terms/recent" element={<SearchTermsListPage variant="recent" />} />
        <Route path="/search-terms/popular" element={<SearchTermsListPage variant="popular" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/legal/terms" element={<LegalPage title="이용약관" paragraphs={termsOfServiceText} />} />
        <Route path="/legal/privacy" element={<LegalPage title="개인정보처리방침" paragraphs={privacyPolicyText} />} />
      </Route>
      <Route element={<LensLayout />}>
        <Route path="/lens" element={<PrismLensPage />} />
        <Route path="/lens/analyzing" element={<LensAnalyzingPage />} />
        <Route path="/lens/result" element={<LensResultPage />} />
      </Route>
    </Routes>
  )
}

export default App
