import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '@/pages/home';
import PaperView from '@/pages/paper-view';
import NotFound from '@/pages/not-found';
import { ROUTES } from '@/constants';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.paper} element={<PaperView />} />
        <Route path={ROUTES.notFound} element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
