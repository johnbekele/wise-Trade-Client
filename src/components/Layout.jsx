import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, Newspaper, BarChart3, Menu, LogOut, LogIn, User, X, Shield, Key, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'AI Trading Insights', href: '/news', icon: Newspaper },
    { name: 'API Keys', href: '/api-keys', icon: Key },
    { name: 'API Documentation', href: '/api-docs', icon: BookOpen },
  ];

  const isAdmin = user?.is_super_Admin;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-ghost p-0 w-10 h-10">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mr-4">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:inline-block">Wise Trade</h1>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className={`btn ${location.pathname === '/admin' ? 'btn-primary' : 'btn-outline'} hidden sm:flex`}>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                )}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.first_name || user?.username || 'User'}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded">ADMIN</span>
                  )}
                </div>
                <button onClick={handleLogout} className="btn btn-ghost text-muted-foreground hover:text-foreground">
                  <LogOut className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0 lg:block`}>
          <div className="h-full flex flex-col">
            <div className="h-16 flex items-center px-6 border-b lg:hidden">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-lg">Wise Trade</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="ml-auto btn btn-ghost p-0 w-8 h-8">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 py-6 px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
                    <Icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                    {item.name}
                  </Link>
                );
              })}
              
              {isAdmin && (
                <Link to="/admin" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive('/admin') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}`}>
                  <Shield className={`h-4 w-4 ${isActive('/admin') ? 'text-primary' : 'text-muted-foreground'}`} />
                  Admin Panel
                </Link>
              )}
            </div>
            
            {!isAuthenticated && (
              <div className="p-4 border-t">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-1">Enterprise Plan</h4>
                  <p className="text-xs text-muted-foreground mb-3">Get advanced AI insights and unlimited data.</p>
                  <Link to="/signup" className="btn btn-primary w-full text-xs h-8" onClick={() => setSidebarOpen(false)}>Upgrade Now</Link>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0 bg-muted/10 min-h-[calc(100vh-4rem)]">
          <div className="container max-w-7xl mx-auto p-4 lg:p-8 space-y-6">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
