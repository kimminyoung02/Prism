import { Route, Routes } from "react-router-dom"
import SearchPage from "./pages/SearchPage"
import CollectingPage from "./pages/CollectingPage"
import AnalyzingPage from "./pages/AnalyzingPage"
import ResultPage from "./pages/ResultPage"
import ReviewsPage from "./pages/ReviewsPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/collecting" element={<CollectingPage />} />
      <Route path="/analyzing" element={<AnalyzingPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
    </Routes>
  )
}

export default App
