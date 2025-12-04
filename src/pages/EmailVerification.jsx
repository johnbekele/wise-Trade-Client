import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, TrendingUp, LogIn, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        const response = await axios.get(`/api/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data?.message || 'Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.detail || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Wise Trade</h1>
          <p className="text-muted-foreground text-sm">Email Verification</p>
        </div>

        {/* Status Card */}
        <div className="card">
          <div className="card-content pt-6 text-center">
            {status === 'verifying' && (
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight">Verifying Email</h2>
                  <p className="text-muted-foreground text-sm">Please wait while we verify your email address...</p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight text-green-600">Email Verified!</h2>
                  <p className="text-muted-foreground text-sm">{message}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 border text-sm">
                  <p className="text-foreground font-medium mb-1">✓ Your account is now active</p>
                  <p className="text-muted-foreground">Redirecting to login in 3 seconds...</p>
                </div>

                <Link to="/login" className="btn btn-primary w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Continue to Login
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight text-destructive">Verification Failed</h2>
                  <p className="text-muted-foreground text-sm">{message}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 border text-left text-sm">
                  <p className="font-medium text-foreground mb-2">What to do:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• The verification link may have expired</li>
                    <li>• Try requesting a new verification email</li>
                    <li>• Contact support if the problem persists</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Link to="/resend-verification" className="btn btn-primary flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Email
                  </Link>
                  <Link to="/login" className="btn btn-outline flex-1">
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help?{' '}
          <a href="mailto:support@wisetrade.com" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
