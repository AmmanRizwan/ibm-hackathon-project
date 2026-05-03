import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { RootState } from '@/store';
import { toggleButton } from '@/store/nav-toggle';

const NavBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get auth state from Redux store
  const { toggle } = useSelector((state: RootState) => state.navToggle);
  const { token } = useSelector((state: RootState) => state.auth);
  
  // Check if user is logged in
  const isLoggedIn = !!token;
  
  // Routes where navbar should not be displayed
  const excludedRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
  
  // Check if current route is in excluded routes
  const shouldHideNavbar = excludedRoutes.includes(location.pathname);
  
  // Debug logging
  console.log('NavBar rendering:', {
    pathname: location.pathname,
    shouldHideNavbar,
    isLoggedIn,
    token: !!token
  });
  
  // Don't render navbar on excluded routes
  if (shouldHideNavbar) {
    console.log('NavBar hidden for route:', location.pathname);
    return null;
  }
  
  const handleSlideBar = () => {
    dispatch(toggleButton(!toggle));
  }

  return (
    <nav
      className="w-full bg-white shadow-md border-b border-gray-200 z-50"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #e5e7eb',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold transition-colors"
            >
              EPay
            </button>
          </div>
          
          {/* Right side - Login/Profile */}
          <div className="flex items-center">
              {
                toggle || location.pathname === '/' ?
                (
                  null
                ) :
                (
                  <Button className='lg:hidden block w-10 h-10' onClick={handleSlideBar}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                )
              }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

// Made with Bob
