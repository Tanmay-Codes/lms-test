import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../lib/redux/slices/authSlice';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { users } from '../lib/dummyData';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to authenticate
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!user) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }
      
      // Remove sensitive data before storing in state
      const { password: _, ...userWithoutPassword } = user;
      
      // Create a mock token
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Store auth in local storage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('jamclef_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('jamclef_token', mockToken);
      } else {
        // Use session storage if not
        sessionStorage.setItem('jamclef_user', JSON.stringify(userWithoutPassword));
        sessionStorage.setItem('jamclef_token', mockToken);
      }
      
      // Update auth state in Redux
      dispatch(loginSuccess({ 
        user: userWithoutPassword,
        token: mockToken
      }));
      
      // Navigate to the page user tried to access or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemoLogin = (role) => {
    const demoAccounts = {
      student: { email: 'student@jamclef.com', password: 'password123' },
      teacher: { email: 'teacher@jamclef.com', password: 'password123' },
      admin: { email: 'admin@jamclef.com', password: 'password123' },
      proctor: { email: 'proctor@jamclef.com', password: 'password123' }
    };
    
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
  };
  
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your account
        </p>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/90">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember-me" 
            checked={rememberMe}
            onCheckedChange={setRememberMe}
          />
          <label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Remember me
          </label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin mr-2"></span>
              Signing in...
            </span>
          ) : "Sign in"}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Demo accounts
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleDemoLogin('student')}
          className="text-xs"
        >
          Student Login
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleDemoLogin('teacher')}
          className="text-xs"
        >
          Teacher Login
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleDemoLogin('admin')}
          className="text-xs"
        >
          Admin Login
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleDemoLogin('proctor')}
          className="text-xs"
        >
          Proctor Login
        </Button>
      </div>
      
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-primary underline underline-offset-4 hover:text-primary/90">
          Create an account
        </Link>
      </div>
    </div>
  );
} 