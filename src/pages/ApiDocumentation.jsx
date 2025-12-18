import { useState } from 'react';
import { BookOpen, Code, Copy, Check, Key, Shield, Globe, ChevronDown, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config/config';

export default function ApiDocumentation() {
  const [copied, setCopied] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    authentication: true,
    ai: true,
    stocks: true,
    apiKeys: false,
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [id]: true });
    setTimeout(() => {
      setCopied({ ...copied, [id]: false });
    }, 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
  };

  const CodeBlock = ({ code, language = 'bash', id }) => (
    <div className="relative">
      <div className="bg-background border rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm font-mono">
          <code>{code}</code>
        </pre>
      </div>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 btn btn-ghost btn-sm"
        title="Copy code"
      >
        {copied[id] ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );

  const EndpointCard = ({ method, path, description, auth, params, requestBody, response, example }) => {
    const methodColors = {
      GET: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      POST: 'bg-green-500/10 text-green-500 border-green-500/20',
      PUT: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      DELETE: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className={`px-3 py-1 rounded text-xs font-semibold border ${methodColors[method] || methodColors.GET}`}>
            {method}
          </span>
          <div className="flex-1">
            <code className="text-sm font-mono font-semibold">{path}</code>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        {auth && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Authentication:</p>
            <p className="text-sm">{auth}</p>
          </div>
        )}

        {params && params.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Parameters:</p>
            <div className="space-y-2">
              {params.map((param, idx) => (
                <div key={idx} className="text-sm">
                  <code className="text-primary font-semibold">{param.name}</code>
                  {param.required && <span className="text-destructive ml-1">*</span>}
                  <span className="text-muted-foreground ml-2">({param.type})</span>
                  {param.description && <span className="text-muted-foreground ml-2">- {param.description}</span>}
                  {param.default && <span className="text-muted-foreground ml-2">Default: {param.default}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {requestBody && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Request Body:</p>
            <CodeBlock code={JSON.stringify(requestBody, null, 2)} language="json" id={`req-${path}`} />
          </div>
        )}

        {response && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Response:</p>
            <CodeBlock code={JSON.stringify(response, null, 2)} language="json" id={`res-${path}`} />
          </div>
        )}

        {example && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Example:</p>
            <CodeBlock code={example} language="bash" id={`ex-${path}`} />
          </div>
        )}
      </div>
    );
  };

  const SectionHeader = ({ title, icon: Icon, expanded, onToggle }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          API Documentation
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete reference for the Wise Trade API endpoints
        </p>
      </div>

      {/* Base URL */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Base URL</h3>
        </div>
        <code className="text-lg font-mono">{API_BASE_URL}</code>
        <p className="text-sm text-muted-foreground mt-2">
          All API endpoints are prefixed with this base URL
        </p>
      </div>

      {/* Authentication Section */}
      <div className="space-y-4">
        <SectionHeader
          title="Authentication"
          icon={Shield}
          expanded={expandedSections.authentication}
          onToggle={() => toggleSection('authentication')}
        />
        {expandedSections.authentication && (
          <div className="space-y-4 pl-2">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <p className="text-sm">
                The Wise Trade API supports two authentication methods:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    1. API Key Authentication
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include your API key in the Authorization header as a Bearer token:
                  </p>
                  <CodeBlock
                    code={`Authorization: Bearer {your_api_key}`}
                    id="auth-api-key"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    API keys start with <code className="bg-muted px-1 rounded">wt_</code> prefix
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    2. JWT Token Authentication
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include your JWT token from login in the Authorization header:
                  </p>
                  <CodeBlock
                    code={`Authorization: Bearer {your_jwt_token}`}
                    id="auth-jwt"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Endpoints Section */}
      <div className="space-y-4">
        <SectionHeader
          title="AI Endpoints"
          icon={Code}
          expanded={expandedSections.ai}
          onToggle={() => toggleSection('ai')}
        />
        {expandedSections.ai && (
          <div className="space-y-4 pl-2">
            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/ai/analyze-news/{query}`}
              description="Analyze market news for a specific query using AI (path parameter)"
              auth="Required: API Key or JWT Token"
              params={[
                { name: 'query', type: 'string', required: true, description: 'Search query for news analysis' }
              ]}
              response={{
                analysis: "AI-generated analysis of the market news...",
                query: "AAPL"
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/ai/analyze-news/AAPL"`}
            />

            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/ai/analyze-news?query={query}`}
              description="Analyze market news for a specific query using AI (query parameter)"
              auth="Required: API Key or JWT Token"
              params={[
                { name: 'query', type: 'string', required: true, description: 'Search query for news analysis' }
              ]}
              response={{
                analysis: "AI-generated analysis of the market news...",
                query: "AAPL"
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/ai/analyze-news?query=AAPL"`}
            />

            <EndpointCard
              method="POST"
              path={`${API_BASE_URL}/api/ai/analyze-news`}
              description="Analyze market news with JSON body"
              auth="Required: API Key or JWT Token"
              requestBody={{
                query: "AAPL",
                limit: 10
              }}
              response={{
                analysis: "AI-generated analysis of the market news...",
                query: "AAPL"
              }}
              example={`curl -X POST \\
  -H "Authorization: Bearer {your_api_key}" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "AAPL", "limit": 10}' \\
  "${API_BASE_URL}/api/ai/analyze-news"`}
            />

            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/ai/market-impact?limit={limit}`}
              description="Get market impact news articles"
              auth="Required: API Key or JWT Token"
              params={[
                { name: 'limit', type: 'integer', required: false, description: 'Number of articles to return', default: '10' }
              ]}
              response={{
                articles: [
                  {
                    title: "Market Impact News Title",
                    summary: "Article summary...",
                    impact: "high"
                  }
                ]
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/ai/market-impact?limit=10"`}
            />
          </div>
        )}
      </div>

      {/* Stocks Endpoints Section */}
      <div className="space-y-4">
        <SectionHeader
          title="Stock Data Endpoints"
          icon={Code}
          expanded={expandedSections.stocks}
          onToggle={() => toggleSection('stocks')}
        />
        {expandedSections.stocks && (
          <div className="space-y-4 pl-2">
            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/stocks/quote/{symbol}`}
              description="Get real-time quote for a stock symbol"
              auth="Required: API Key or JWT Token"
              params={[
                { name: 'symbol', type: 'string', required: true, description: 'Stock ticker symbol (e.g., AAPL, GOOGL)' }
              ]}
              response={{
                symbol: "AAPL",
                data: {
                  "Global Quote": {
                    "01. symbol": "AAPL",
                    "02. open": "150.00",
                    "03. high": "152.00",
                    "04. low": "149.50",
                    "05. price": "151.25",
                    "06. volume": "50000000",
                    "07. latest trading day": "",
                    "08. previous close": "150.50",
                    "09. change": "0.75",
                    "10. change percent": "0.50%"
                  }
                }
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/stocks/quote/AAPL"`}
            />

            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/stocks/candles/{symbol}?resolution={resolution}&days={days}`}
              description="Get candlestick data for charts"
              auth="Required: API Key or JWT Token"
              params={[
                { name: 'symbol', type: 'string', required: true, description: 'Stock ticker symbol' },
                { name: 'resolution', type: 'string', required: false, description: 'Candle resolution: 1m, 5m, 15m, 30m, 1h, 1d', default: '1d' },
                { name: 'days', type: 'integer', required: false, description: 'Number of days to look back', default: '30' }
              ]}
              response={{
                symbol: "AAPL",
                data: {
                  "Time Series (1d)": {}
                }
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/stocks/candles/AAPL?resolution=1d&days=30"`}
            />

            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/stocks/profile/{symbol}`}
              description="Get company profile and information"
              auth="Required: API Key or JWT Token"
              params={[
                { name: 'symbol', type: 'string', required: true, description: 'Stock ticker symbol' }
              ]}
              response={{
                symbol: "AAPL",
                data: {
                  Symbol: "AAPL",
                  Name: "Apple Inc.",
                  Description: "Apple Inc. - NASDAQ",
                  Country: "US",
                  Sector: "Technology",
                  Industry: "Consumer Electronics",
                  Exchange: "NASDAQ",
                  Currency: "USD"
                }
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/stocks/profile/AAPL"`}
            />

            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/stocks/search?keywords={keywords}`}
              description="Search for stocks by symbol or company name"
              auth="Required: API Key or JWT Token"
              params={[
                { name: 'keywords', type: 'string', required: true, description: 'Search keywords (symbol or company name)' }
              ]}
              response={{
                results: [
                  {
                    symbol: "AAPL",
                    name: "Apple Inc.",
                    type: "EQUITY",
                    region: "US"
                  }
                ]
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/stocks/search?keywords=Apple"`}
            />

            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/stocks/market-movers`}
              description="Get top gainers, losers, and most active stocks"
              auth="Required: API Key or JWT Token"
              response={{
                top_gainers: [
                  {
                    ticker: "AAPL",
                    price: "151.25",
                    change_amount: "2.50",
                    change_percentage: "1.68%",
                    volume: "50000000"
                  }
                ],
                top_losers: [],
                most_actively_traded: []
              }}
              example={`curl -H "Authorization: Bearer {your_api_key}" \\
  "${API_BASE_URL}/api/stocks/market-movers"`}
            />
          </div>
        )}
      </div>

      {/* API Keys Management Section */}
      <div className="space-y-4">
        <SectionHeader
          title="API Key Management"
          icon={Key}
          expanded={expandedSections.apiKeys}
          onToggle={() => toggleSection('apiKeys')}
        />
        {expandedSections.apiKeys && (
          <div className="space-y-4 pl-2">
            <div className="bg-muted/30 border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> API key management endpoints require JWT token authentication (not API key authentication).
                You must be logged in to create, list, or delete API keys.
              </p>
            </div>

            <EndpointCard
              method="POST"
              path={`${API_BASE_URL}/api/api-keys/`}
              description="Create a new API key"
              auth="Required: JWT Token (from login)"
              requestBody={{
                name: "My API Key",
                expires_days: 30
              }}
              response={{
                api_key: "wt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                id: "507f1f77bcf86cd799439011",
                name: "My API Key",
                key_prefix: "wt_xxxxx",
                created_at: "2024-01-01T00:00:00",
                expires_at: "2024-01-31T00:00:00",
                message: "API key created successfully. Save this key now - it won't be shown again!"
              }}
              example={`curl -X POST \\
  -H "Authorization: Bearer {your_jwt_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My API Key", "expires_days": 30}' \\
  "${API_BASE_URL}/api/api-keys/"`}
            />

            <EndpointCard
              method="GET"
              path={`${API_BASE_URL}/api/api-keys/`}
              description="List all API keys for the authenticated user"
              auth="Required: JWT Token (from login)"
              response={{
                api_keys: [
                  {
                    id: "507f1f77bcf86cd799439011",
                    name: "My API Key",
                    key_prefix: "wt_xxxxx",
                    is_active: true,
                    created_at: "2024-01-01T00:00:00",
                    last_used_at: "2024-01-15T10:30:00",
                    expires_at: "2024-01-31T00:00:00"
                  }
                ]
              }}
              example={`curl -H "Authorization: Bearer {your_jwt_token}" \\
  "${API_BASE_URL}/api/api-keys/"`}
            />

            <EndpointCard
              method="DELETE"
              path={`${API_BASE_URL}/api/api-keys/{api_key_id}`}
              description="Delete an API key"
              auth="Required: JWT Token (from login)"
              params={[
                { name: 'api_key_id', type: 'string', required: true, description: 'ID of the API key to delete' }
              ]}
              response={{
                message: "API key deleted successfully",
                api_key_id: "507f1f77bcf86cd799439011"
              }}
              example={`curl -X DELETE \\
  -H "Authorization: Bearer {your_jwt_token}" \\
  "${API_BASE_URL}/api/api-keys/507f1f77bcf86cd799439011"`}
            />
          </div>
        )}
      </div>

      {/* Error Responses */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Error Responses
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold mb-1">401 Unauthorized</p>
            <CodeBlock
              code={JSON.stringify({
                detail: "Authentication required. Provide a Bearer token or API key."
              }, null, 2)}
              id="error-401"
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">403 Forbidden</p>
            <CodeBlock
              code={JSON.stringify({
                detail: "Your AI access has been blocked. Please contact an administrator."
              }, null, 2)}
              id="error-403"
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">404 Not Found</p>
            <CodeBlock
              code={JSON.stringify({
                detail: "Resource not found"
              }, null, 2)}
              id="error-404"
            />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">500 Internal Server Error</p>
            <CodeBlock
              code={JSON.stringify({
                detail: "Error message describing what went wrong"
              }, null, 2)}
              id="error-500"
            />
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-muted/30 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Rate Limiting</h2>
        <p className="text-sm text-muted-foreground">
          API requests are subject to rate limiting to ensure fair usage. If you exceed the rate limit,
          you will receive a 429 Too Many Requests response. Please implement appropriate retry logic
          with exponential backoff in your applications.
        </p>
      </div>
    </div>
  );
}

