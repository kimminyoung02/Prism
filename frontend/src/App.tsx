import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import SearchPage from "./pages/SearchPage"
import CollectingPage from "./pages/CollectingPage"
import AnalyzingPage from "./pages/AnalyzingPage"
import ResultPage from "./pages/ResultPage"
import ReviewsPage from "./pages/ReviewsPage"
import FavoritesPage from "./pages/FavoritesPage"
import MyTab from "./pages/MyTab"

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
      </Route>
    </Routes>
  )
}

export default App
