import { NavLink, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/",         label: "Home" },
  { to: "/graphics", label: "Graphics" },
  { to: "/server",   label: "Servers" },
];

function Nav() {
  const { pathname } = useLocation();
  // Keep the landing page clean — nav appears on the interior routes.
  if (pathname === "/") return null;

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-8 h-14 backdrop-blur-md border-b border-line"
      style={{ background: "color-mix(in srgb, var(--bg1) 78%, transparent)" }}
    >
      <NavLink to="/" className="font-bold tracking-tight text-body">
        x<span className="text-acc">Dele1ed</span>
      </NavLink>
      <nav className="flex items-center gap-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `nav-link px-3 py-1.5 rounded-lg text-sm font-medium ${isActive ? "active" : ""}`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <a
          href="#contact"
          className="nav-link px-3 py-1.5 rounded-lg text-sm font-medium hidden sm:inline"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Nav;
