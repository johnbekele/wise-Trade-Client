import { Search, X, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { stockAPI } from '../services/api';

export default function StockSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await stockAPI.searchSymbol(query);
        // Handle both old format (bestMatches) and new format (results array)
        const searchResults = data.results || data.quotes || [];
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol) => {
    onSelect(symbol);
    setQuery('');
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search to add stock..."
          className="input pl-9 pr-9 w-full bg-background"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md shadow-md border animate-in fade-in zoom-in-95 duration-200 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="p-1">
              {results.map((result, index) => {
                const symbol = result.symbol || result['1. symbol'];
                const name = result.longname || result.shortname || result['2. name'] || symbol;
                const type = result.quoteType || result['3. type'] || 'EQUITY';
                const region = result.exchDisp || result['4. region'] || 'US';
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(symbol)}
                    className="w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-sm text-left transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-full font-medium">
                          {type}
                        </span>
                        {region !== 'US' && (
                          <span className="text-[10px] text-muted-foreground">
                            {region}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{name}</p>
                    </div>
                    <Plus className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
