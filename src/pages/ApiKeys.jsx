import { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';
import { useAuth } from '../context/AuthContext';

export default function ApiKeys() {
  const { isAuthenticated } = useAuth();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [expiresDays, setExpiresDays] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchApiKeys();
    }
  }, [isAuthenticated]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api-keys/`);
      setApiKeys(response.data.api_keys);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      setError('Please enter a name for the API key');
      return;
    }

    try {
      setCreating(true);
      setError('');
      const payload = {
        name: newKeyName.trim(),
      };
      if (expiresDays && parseInt(expiresDays) > 0) {
        payload.expires_days = parseInt(expiresDays);
      }
      const response = await axios.post(`${API_BASE_URL}/api-keys/`, payload);
      setNewKey(response.data);
      setNewKeyName('');
      setExpiresDays('');
      await fetchApiKeys();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api-keys/${keyId}`);
      await fetchApiKeys();
      if (newKey && newKey.id === keyId) {
        setNewKey(null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete API key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please log in to manage your API keys</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Key className="h-8 w-8 text-primary" />
          API Keys
        </h1>
        <p className="text-muted-foreground mt-2">
          Create and manage API keys to access AI and trading functionality programmatically
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* New Key Display */}
      {newKey && (
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Info className="h-5 w-5" />
            <span>New API Key Created</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Save this API key now. You won't be able to see it again!
          </p>
          <div className="bg-background border rounded-lg p-4 flex items-center gap-3">
            <code className="flex-1 font-mono text-sm break-all">
              {showKey ? newKey.api_key : '•'.repeat(newKey.api_key.length)}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="btn btn-ghost btn-sm"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={() => copyToClipboard(newKey.api_key)}
              className="btn btn-primary btn-sm"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setNewKey(null);
                setShowKey(false);
              }}
              className="btn btn-outline"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create New Key Form */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New API Key
        </h2>
        <form onSubmit={createApiKey} className="space-y-4">
          <div>
            <label htmlFor="keyName" className="block text-sm font-medium mb-2">
              Key Name
            </label>
            <input
              id="keyName"
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Production API, Development Key"
              className="input input-bordered w-full"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Give your API key a descriptive name to identify its purpose
            </p>
          </div>
          <div>
            <label htmlFor="expiresDays" className="block text-sm font-medium mb-2">
              Expires In (Days) <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              id="expiresDays"
              type="number"
              value={expiresDays}
              onChange={(e) => setExpiresDays(e.target.value)}
              placeholder="Leave empty for no expiration"
              min="1"
              className="input input-bordered w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set an expiration date for the API key (optional)
            </p>
          </div>
          <button
            type="submit"
            disabled={creating || !newKeyName.trim()}
            className="btn btn-primary"
          >
            {creating ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create API Key
              </>
            )}
          </button>
        </form>
      </div>

      {/* API Keys List */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your API Keys</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No API keys yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className={`border rounded-lg p-4 flex items-center justify-between ${
                  !key.is_active || isExpired(key.expires_at)
                    ? 'opacity-60 bg-muted/50'
                    : 'bg-background'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{key.name}</h3>
                    {!key.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                        Inactive
                      </span>
                    )}
                    {isExpired(key.expires_at) && (
                      <span className="px-2 py-0.5 text-xs bg-destructive/10 text-destructive rounded">
                        Expired
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-mono">{key.key_prefix}...</span>
                    <span>Created: {formatDate(key.created_at)}</span>
                    {key.last_used_at && (
                      <span>Last used: {formatDate(key.last_used_at)}</span>
                    )}
                    {key.expires_at && (
                      <span className={isExpired(key.expires_at) ? 'text-destructive' : ''}>
                        Expires: {formatDate(key.expires_at)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteApiKey(key.id)}
                  className="btn btn-ghost btn-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Delete API key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-muted/30 border rounded-lg p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Info className="h-5 w-5" />
          How to Use Your API Key
        </h3>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Include your API key in the Authorization header as a Bearer token:
          </p>
          <div className="bg-background border rounded p-3 font-mono text-xs overflow-x-auto">
            <div>Authorization: Bearer {'{your_api_key}'}</div>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Example with curl:</p>
            <div className="bg-background border rounded p-3 font-mono text-xs overflow-x-auto">
              <div>curl -H "Authorization: Bearer {'{your_api_key}'}" \</div>
              <div className="ml-4">{API_BASE_URL}/api/ai/analyze-news?query=AAPL</div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <p className="font-medium">Available Endpoints:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>AI Analysis: <code className="bg-muted px-1 rounded">/api/ai/*</code></li>
              <li>Stock Data: <code className="bg-muted px-1 rounded">/api/stocks/*</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

