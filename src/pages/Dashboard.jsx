import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockCard from '../components/StockCard';
import StockSearch from '../components/StockSearch';
import { useWatchlist, useMarketMovers } from '../hooks/useStocks';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);

  // Use React Query hooks
  const { 
    data: stockData = [], 
    isLoading, 
    isError,
    refetch: refetchStocks 
  } = useWatchlist(watchlist);

  const {
    data: marketMovers,
    isLoading: loadingMovers,
    refetch: refetchMovers
  } = useMarketMovers();

  const handleAddStock = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleRemoveStock = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  const handleRefresh = () => {
    refetchStocks();
    refetchMovers();
  };

  // Convert array to object for easier lookup
  const stockDataMap = {};
  stockData.forEach((item, index) => {
    if (!item.error) {
      stockDataMap[watchlist[index]] = item;
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your watchlist and market trends.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <StockSearch onSelect={handleAddStock} />
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isLoading || loadingMovers}
            className="btn btn-outline whitespace-nowrap"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Market Movers Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Gainers */}
        <div className="card">
          <div className="card-header pb-2">
            <div className="text-sm font-medium text-muted-foreground">Top Gainers</div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Market Leaders
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {loadingMovers ? (
                <div className="space-y-2">
                   {[1, 2, 3].map(i => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}
                </div>
              ) : (
                marketMovers?.top_gainers?.slice(0, 3).map((stock, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{stock.ticker}</div>
                      <div className="text-xs text-muted-foreground hidden xl:block">${stock.price}</div>
                    </div>
                    <div className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      +{parseFloat(stock.change_percentage).toFixed(2)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Losers */}
        <div className="card">
          <div className="card-header pb-2">
            <div className="text-sm font-medium text-muted-foreground">Top Losers</div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Market Laggards
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {loadingMovers ? (
                <div className="space-y-2">
                   {[1, 2, 3].map(i => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}
                </div>
              ) : (
                marketMovers?.top_losers?.slice(0, 3).map((stock, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{stock.ticker}</div>
                      <div className="text-xs text-muted-foreground hidden xl:block">${stock.price}</div>
                    </div>
                    <div className="text-sm font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">
                      {parseFloat(stock.change_percentage).toFixed(2)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="card">
          <div className="card-header pb-2">
            <div className="text-sm font-medium text-muted-foreground">Most Active</div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              High Volume
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {loadingMovers ? (
                <div className="space-y-2">
                   {[1, 2, 3].map(i => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}
                </div>
              ) : (
                marketMovers?.most_actively_traded?.slice(0, 3).map((stock, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-semibold">{stock.ticker}</div>
                    <div className="text-sm text-muted-foreground">
                      {parseInt(stock.volume).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Your Watchlist</h3>
          <p className="text-sm text-muted-foreground">Track your favorite stocks in real-time</p>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card h-48 animate-pulse bg-muted/20"></div>
              ))}
           </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
            <p className="font-medium">Error loading watchlist data</p>
            <button onClick={refetchStocks} className="btn btn-outline border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground mt-4">
              Retry
            </button>
          </div>
        ) : watchlist.length === 0 ? (
           <div className="text-center py-16 border-2 border-dashed rounded-lg">
             <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
             <h3 className="text-lg font-medium">Your watchlist is empty</h3>
             <p className="text-muted-foreground mb-6">Search for stocks above to start tracking them.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((symbol) => (
              <div key={symbol} className="group relative">
                <button
                  onClick={() => handleRemoveStock(symbol)}
                  className="absolute -top-2 -right-2 z-10 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
                  title="Remove from watchlist"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="h-full transition-transform hover:-translate-y-1 duration-200">
                  <StockCard
                    symbol={symbol}
                    data={stockDataMap[symbol]}
                    onClick={() => navigate(`/stock/${symbol}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
