import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, TrendingUp, AlertCircle, CheckCircle, Mail, Loader2 } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);

    setLoading(false);

    if (result.success) {
      setShowVerificationMessage(true);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <div className="flex items-center gap-2">
             <h1 className="text-3xl font-bold tracking-tight">Wise Trade</h1>
          </div>
          <p className="text-muted-foreground text-sm">Join the future of trading</p>
        </div>

        {showVerificationMessage ? (
          <div className="card animate-in fade-in zoom-in-95 duration-300">
            <div className="card-content pt-6 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Check your email</h2>
                <p className="text-muted-foreground">
                  We've sent a verification link to <span className="font-medium text-foreground">{formData.email}</span>
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 text-left text-sm border">
                <p className="font-medium mb-2 text-foreground">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Check your email inbox (and spam)</li>
                  <li>Click the verification link</li>
                  <li>Sign in to your account</li>
                </ol>
              </div>

              <div className="space-y-3 pt-4">
                <Link to="/login" className="btn btn-primary w-full">
                  Go to Login
                </Link>
                <button
                  onClick={() => setShowVerificationMessage(false)}
                  className="btn btn-ghost w-full text-muted-foreground hover:text-foreground"
                >
                  Back to Signup
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header space-y-1 text-center">
               <h2 className="card-title text-xl">Create an account</h2>
               <p className="card-description">Enter your details to get started</p>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-3 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="username" className="label">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="input"
                    placeholder="johndoe"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="label">First name</label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="input"
                      placeholder="John"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="label">Last name</label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Doe"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="m@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="label">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {!showVerificationMessage && (
          <p className="px-8 text-center text-xs text-muted-foreground mt-6">
            By clicking create account, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
