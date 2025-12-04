import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, TrendingUp, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Wise Trade</h1>
          <p className="text-muted-foreground text-sm">Reset your password</p>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-header space-y-1 text-center">
            <h2 className="card-title text-xl">Forgot password?</h2>
            <p className="card-description">
              Enter your email and we'll send you a reset link
            </p>
          </div>
          <div className="card-content">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-3 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="m@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight">Check your email</h3>
                  <p className="text-muted-foreground text-sm">
                    If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent a reset link.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border text-left text-sm">
                  <p className="font-medium text-foreground mb-2">Next steps:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Check your inbox (and spam)</li>
                    <li>• Click the reset link</li>
                    <li>• The link expires in 15 minutes</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
