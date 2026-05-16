import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProblemList from './pages/ProblemList'
import Generate from './pages/Generate'
import ProblemDetail from './pages/ProblemDetail'
import Stats from './pages/Stats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
