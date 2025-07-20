import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';

function AnimatedRoutes() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  // Pages that don't show navbar/footer
  const hideLayout = !isLoggedIn && ['/', '/login', '/register'].includes(location.pathname);

  if (!isLoggedIn && !['/', '/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  const variants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
  };

  const transition = { duration: 0.4, ease: 'easeInOut' };

  const renderWithMotion = (Component, protectedRoute = false) => {
    const content = (
      <motion.div initial="initial" animate="in" exit="out" variants={variants} transition={transition}>
        <Component />
        {!hideLayout && <Footer />}
      </motion.div>
    );

    return protectedRoute ? <PrivateRoute>{content}</PrivateRoute> : content;
  };

  return (
    <>
      {/* Background bubbles */}
      <div className="floating-bg" aria-hidden="true">
        <div className="floating-object size1" style={{ top: '10%', left: '20%' }} />
        <div className="floating-object size2" style={{ top: '40%', left: '80%' }} />
        <div className="floating-object size3" style={{ top: '75%', left: '5%' }} />
        <div className="floating-object size1" style={{ top: '20%', left: '95%' }} />
        <div className="floating-object size2" style={{ top: '60%', left: '90%' }} />
      </div>

      <div id="app-container">
        {!hideLayout && <Navbar />}

        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={renderWithMotion(LandingPage)} />
            <Route path="/login" element={renderWithMotion(Login)} />
            <Route path="/register" element={renderWithMotion(Register)} />
            <Route path="/dashboard" element={renderWithMotion(Dashboard, true)} />
            <Route path="/courses" element={renderWithMotion(Courses, true)} />
            <Route path="/profile" element={renderWithMotion(Profile, true)} />
            <Route path="/contact" element={renderWithMotion(ContactUs, true)} />
            <Route path="*" element={renderWithMotion(LandingPage)} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
