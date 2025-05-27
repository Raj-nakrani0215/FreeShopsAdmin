import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { restoreAuth } from './store/slices/authSlice';
import type { RootState } from './store/store';
import './App.css';
import RootLayout from './components/layout/RootLayout';
import LoginForm from './components/login/login';
import HomePage from './components/pages/home';
import Article from './components/pages/article';
import AutoDealerShip from './components/pages/autoDealerShip';
import Faq from './components/pages/Faq';
import BlogCategory from './components/pages/blog/blogCategory';
// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// App wrapper to handle auth restoration
const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <PublicRoute><LoginForm /></PublicRoute>
    },
    {
      path: '/',
      element: <ProtectedRoute><RootLayout /></ProtectedRoute>,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'article',
          element: <Article />
        },
        {
          path: 'auto-dealership',
          element: <AutoDealerShip />
        },
        {
          path: 'blog',
          children: [
            {
              path: 'category',
              element: <BlogCategory />
            },
            {
              path: 'page',
              element: <div>Page Blog</div>
            }
          ]
        },
        {
          path: 'career',
          element: <div>Career Page</div>,
          children: [
            {
              path: 'main',
              element: <div>Career Main Page</div>
            },
            {
              path: 'openings',
              element: <div>Career Openings Page</div>
            },
            {
              path: 'category',
              element: <div>Career Category Page</div>
            }
          ]
        },
        {
          path: 'location',
          element: <div>Location Page</div>
        },
        {
          path: 'faqs',
          element: <Faq />
        },
        {
          path: 'news',
          element: <div>Free Shop News Page</div>,
          children: [
            {
              path: 'main',
              element: <div>Free Shop News Main Page</div>
            },
            {
              path: 'category',
              element: <div>Free Shop News Category Page</div>
            }
          ]
        },
        {
          path: 'help',
          element: <div>Help Center Page</div>,
          children: [
            {
              path: 'category',
              element: <div>Help Center Category Page</div>
            },
            {
              path: 'knowledge',
              element: <div>Help Center Knowledge Page</div>
            }
          ]
        },
        {
          path: 'how-it-works',
          element: <div>How It Works Page</div>,
          children: [
            {
              path: 'main',
              element: <div>How it Works Main Page</div>
            },
            {
              path: 'bottom',
              element: <div>Bottom How it Works Page</div>
            }
          ]
        },
        {
          path: 'jobs',
          element: <div>Jobs Page</div>,
          children: [
            {
              path: 'service',
              element: <div>Jobs Service Page</div>
            },
            {
              path: 'list',
              element: <div>Jobs List Page</div>
            }
          ]
        },
        {
          path: 'press',
          element: <div>Press Page</div>,
          children: [
            {
              path: 'category',
              element: <div>Press Category Page</div>
            },
            {
              path: 'topic',
              element: <div>Press Topic Page</div>
            },
            {
              path: 'news',
              element: <div>Press News Page</div>
            }
          ]
        },
        {
          path: 'product',
          element: <div>Product Page</div>,
          children: [
            {
              path: 'category',
              element: <div>Product Category Page</div>
            },
            {
              path: 'subcategory',
              element: <div>Product Sub Category Page</div>
            },
            {
              path: 'condition',
              element: <div>Product Condition Page</div>
            },
            {
              path: 'list',
              element: <div>Product List Page</div>
            }
          ]
        },
        {
          path: 'privacy-terms',
          element: <div>Privacy & Terms Page</div>
        },
        {
          path: 'trust-safety',
          element: <div>Trust & Safety Page</div>
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
