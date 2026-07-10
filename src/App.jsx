import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme, Backdrop, ParticleField } from "./site/atmosphere.jsx";
import Nav from "./site/Nav.jsx";

const Landing  = lazy(() => import("./site/pages/Landing.jsx"));
const Graphics = lazy(() => import("./site/pages/Graphics.jsx"));
const Server   = lazy(() => import("./site/pages/Server.jsx"));

/* Particle behavior per theme: graphics = cursor-reactive bokeh,
   xapocalypse = rising spores + blood-moon glow, deadlands = desert dust,
   others = ambient drift. */
function Atmosphere() {
  const { theme } = useTheme();
  const variant =
    theme === "xapocalypse" ? "spore" : theme === "deadlands" ? "dust" : "drift";
  const count = theme === "deadlands" ? 70 : theme === "xapocalypse" ? 24 : 26;
  return (
    <>
      <Backdrop />
      <ParticleField
        count={count}
        variant={variant}
        cursorReactive={theme === "graphics"}
        bloodMoon={theme === "xapocalypse"}
      />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-muted text-sm tracking-widest uppercase">loading…</span>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Landing />} />
          <Route path="/graphics" element={<Graphics />} />
          <Route path="/server"   element={<Server />} />
          <Route path="*"         element={<Landing />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function Shell() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site min-h-screen" data-theme={theme}>
      <Atmosphere />
      <Nav />
      <AnimatedRoutes />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}

export default App;
