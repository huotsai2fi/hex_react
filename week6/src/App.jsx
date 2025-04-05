import { Outlet, NavLink } from 'react-router';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
            {/* With end, the <NavLink> will only be active if the current URL exactly matches the to value. */}
          </li>
          <li>
            <NavLink to="/products">Products</NavLink>
          </li>
          <li>
            <NavLink to="/cart">Cart</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
