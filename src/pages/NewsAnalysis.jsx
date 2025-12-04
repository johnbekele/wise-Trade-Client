import { useState } from 'react';
import { Newspaper, TrendingUp, RefreshCw, Search, AlertCircle, ArrowUp, ArrowDown, Minus, Building2, Lightbulb, CheckCircle, Target, Zap, Lock, LogIn, ChevronRight } from 'lucide-react';
import { useMarketImpactNews, useNewsAnalysis } from '../hooks/useNews';
import { getLogoProps } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Helper function to parse and structure markdown-like analysis text
// (Kept the same logic but ensured it handles various formats)
function parseAnalysisText(text) {
  if (!text) return { sections: [], rawText: '' };

  const lines = text.split('\n');
  const sections = [];
  let currentSection = null;
  let currentItems = [];
  let currentParagraph = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      // If we have accumulated paragraph text, add it to current item
      if (currentParagraph.length > 0 && currentItems.length > 0) {
        const lastItem = currentItems[currentItems.length - 1];
        const paragraphText = currentParagraph.join(' ').trim();
        if (lastItem.description) {
          lastItem.description += ' ' + paragraphText;
        } else {
          lastItem.description = paragraphText;
        }
        currentParagraph = [];
      }
      return;
    }

    // Main section headers
    if (trimmedLine.match(/^#{1,4}\s+\d+\./) || trimmedLine.match(/^\d+\.\s+[A-Z][^a-z]{10,}/) || trimmedLine.match(/^#{1,4}\s+[A-Z]/)) {
      if (currentSection) {
        currentSection.items = currentItems;
        sections.push(currentSection);
      }
      
      currentSection = {
        title: trimmedLine.replace(/^#{1,4}\s+/, '').replace(/^\d+\.\s+/, '').trim(),
        items: [],
        content: []
      };
      currentItems = [];
      currentParagraph = [];
    }
    // Numbered list items
    else if (trimmedLine.match(/^\d+\.\s+\*\*/)) {
      if (currentParagraph.length > 0 && currentItems.length > 0) {
        const lastItem = currentItems[currentItems.length - 1];
        lastItem.description = (lastItem.description || '') + ' ' + currentParagraph.join(' ').trim();
        currentParagraph = [];
      }

      const match = trimmedLine.match(/^\d+\.\s+\*\*(.+?)\*\*(.*)/) || trimmedLine.match(/^\d+\.\s+(.+)/);
      if (match) {
        currentItems.push({
          type: 'item',
          title: match[1]?.trim() || match[0].replace(/^\d+\.\s+/, '').trim(),
          description: match[2]?.trim() || '',
          subPoints: []
        });
      }
    }
    // Bullet points
    else if (trimmedLine.match(/^\s*[\*\-•]\s+/) || trimmedLine.match(/^\s{2,}[\*\-•]/)) {
      const match = trimmedLine.match(/^\s*[\*\-•]\s+\*\*(.+?)\*\*:?\s*(.*)/) || trimmedLine.match(/^\s*[\*\-•]\s+(.+)/);
      if (match) {
        if (currentItems.length > 0) {
          currentItems[currentItems.length - 1].subPoints.push({
            label: match[1]?.includes(':') ? match[1].replace(':', '').trim() : '',
            text: match[2]?.trim() || match[1]?.trim() || match[0].replace(/^\s*[\*\-•]\s+/, '').trim()
          });
        } else if (currentSection) {
          currentSection.content.push(trimmedLine);
        }
      }
      currentParagraph = [];
    }
    // Regular paragraph
    else if (trimmedLine && currentSection) {
      currentParagraph.push(trimmedLine);
    }
  });

  if (currentParagraph.length > 0 && currentItems.length > 0) {
    const lastItem = currentItems[currentItems.length - 1];
    lastItem.description = (lastItem.description || '') + ' ' + currentParagraph.join(' ').trim();
  }

  if (currentSection) {
    currentSection.items = currentItems;
    sections.push(currentSection);
  }

  return { sections, rawText: text };
}

export default function NewsAnalysis() {
  const [query, setQuery] = useState('');
  const { isAuthenticated } = useAuth();

  const {
    data: marketImpactData,
    isLoading: loadingMarket,
    refetch: refetchMarketImpact
  } = useMarketImpactNews(10, { enabled: isAuthenticated });

  const {
    analyze,
    data: analysisData,
    isLoading: loadingAnalysis,
    reset: resetAnalysis
  } = useNewsAnalysis();

  const marketImpactNews = marketImpactData?.news_items || [];

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    analyze(query);
  };

  const getImpactBadgeStyles = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getImpactDirectionIcon = (direction) => {
    switch (direction?.toLowerCase()) {
      case 'positive': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <ArrowDown className="w-4 h-4 text-destructive" />;
      case 'neutral': return <Minus className="w-4 h-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const parsedAnalysis = analysisData ? parseAnalysisText(analysisData.analysis) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI News Analysis</h2>
        <p className="text-muted-foreground mt-1">Deep insights powered by Claude AI</p>
      </div>

      {!isAuthenticated ? (
        <div className="card border-dashed">
          <div className="card-content py-16 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
               <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Sign in to access enterprise-grade market analysis and AI trading insights.
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="btn btn-primary px-8">Sign In</Link>
              <Link to="/signup" className="btn btn-outline px-8">Create Account</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl text-left">
               <div className="space-y-2">
                  <div className="bg-secondary w-10 h-10 rounded flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Precise Impact Analysis</h3>
                  <p className="text-sm text-muted-foreground">Understand exactly how news affects specific sectors and companies.</p>
               </div>
               <div className="space-y-2">
                  <div className="bg-secondary w-10 h-10 rounded flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Real-time Processing</h3>
                  <p className="text-sm text-muted-foreground">Analysis generated in seconds using advanced LLMs.</p>
               </div>
               <div className="space-y-2">
                  <div className="bg-secondary w-10 h-10 rounded flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Actionable Insights</h3>
                  <p className="text-sm text-muted-foreground">Clear trading signals and risk assessments.</p>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <>
        {/* Market Impact Section */}
        <div className="card">
          <div className="card-header flex flex-row items-center justify-between">
             <div>
                <h3 className="card-title">Market Impact Monitor</h3>
                <p className="card-description">High-impact news events detected by AI</p>
             </div>
             <button 
               onClick={() => refetchMarketImpact()} 
               disabled={loadingMarket}
               className="btn btn-ghost btn-sm"
             >
               <RefreshCw className={`w-4 h-4 mr-2 ${loadingMarket ? 'animate-spin' : ''}`} />
               Refresh
             </button>
          </div>
          <div className="card-content">
            {loadingMarket ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
               </div>
            ) : marketImpactNews.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {marketImpactNews.map((item, index) => (
                   <div key={index} className="group rounded-lg border p-5 hover:shadow-md transition-shadow bg-card text-card-foreground">
                      <div className="flex items-start justify-between mb-4">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                               <span className="px-2 py-0.5 bg-secondary rounded text-foreground">{item.source}</span>
                               <span>•</span>
                               <span>Rank #{item.rank}</span>
                            </div>
                            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                               {item.title}
                            </h4>
                         </div>
                         <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getImpactBadgeStyles(item.impact_level)}`}>
                            {getImpactDirectionIcon(item.impact_direction)}
                            {item.impact_level}
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="text-sm text-muted-foreground line-clamp-3">
                            <span className="font-semibold text-foreground">Impact: </span>
                            {item.why_it_matters}
                         </div>
                         
                         {(item.affected_companies?.length > 0 || item.affected_sectors?.length > 0) && (
                            <div className="flex flex-wrap gap-2">
                               {item.affected_companies?.slice(0, 3).map((company, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">
                                     {company}
                                  </span>
                               ))}
                               {item.affected_sectors?.slice(0, 2).map((sector, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs border">
                                     {sector}
                                  </span>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No high-impact news detected at this moment.
              </div>
            )}
          </div>
        </div>

        {/* Custom Analysis Section */}
        <div className="card">
          <div className="card-header">
             <h3 className="card-title">Deep Dive Analysis</h3>
             <p className="card-description">Ask Claude to analyze specific companies or trends</p>
          </div>
          <div className="card-content space-y-6">
             <form onSubmit={handleAnalyze} className="flex gap-3">
                <div className="relative flex-1">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                   <input 
                     type="text" 
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="e.g. Impact of interest rate hikes on tech stocks..."
                     className="input pl-9"
                     disabled={loadingAnalysis}
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={loadingAnalysis || !query.trim()}
                  className="btn btn-primary px-6"
                >
                   {loadingAnalysis ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                   ) : (
                      <Zap className="w-4 h-4 mr-2" />
                   )}
                   Analyze
                </button>
             </form>

             {analysisData && (
               <div className="rounded-lg border bg-muted/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                     <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">Analysis Results</span>
                     </div>
                     <button onClick={resetAnalysis} className="text-xs text-muted-foreground hover:text-foreground">
                        Clear Results
                     </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                     {parsedAnalysis.rawText.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <div key={idx} className="h-2"></div>;

                        // Headers
                        if (trimmed.match(/^#{1,4}\s/) || trimmed.match(/^\d+\.\s+[A-Z]/)) {
                           const text = trimmed.replace(/^#{1,4}\s+/, '').replace(/^\d+\.\s+/, '');
                           return (
                              <h3 key={idx} className="text-lg font-bold text-foreground flex items-center gap-2 mt-4 mb-2">
                                 {text}
                              </h3>
                           );
                        }

                        // Numbered items with bold titles
                        if (trimmed.match(/^\d+\.\s+\*\*/)) {
                           const match = trimmed.match(/^\d+\.\s+\*\*(.+?)\*\*(.*)/) || trimmed.match(/^\d+\.\s+(.+)/);
                           const title = match[1]?.trim();
                           const desc = match[2]?.trim();
                           
                           return (
                              <div key={idx} className="bg-card border p-4 rounded-lg shadow-sm ml-4 relative">
                                 <div className="absolute -left-3 top-4 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold border-2 border-background">
                                    {trimmed.match(/^(\d+)\./)[1]}
                                 </div>
                                 <h4 className="font-semibold text-foreground mb-1">{title}</h4>
                                 <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                              </div>
                           );
                        }

                        // Bullet points
                        if (trimmed.match(/^\s*[\*\-•]\s+/)) {
                           const match = trimmed.match(/^\s*[\*\-•]\s+\*\*(.+?)\*\*:?\s*(.*)/) || trimmed.match(/^\s*[\*\-•]\s+(.+)/);
                           const label = match[1]?.replace(':', '').trim();
                           const text = match[2]?.trim() || match[0]?.replace(/^\s*[\*\-•]\s+/, '').trim();
                           
                           return (
                              <div key={idx} className="flex gap-3 ml-6 py-1">
                                 <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                 <p className="text-sm text-muted-foreground">
                                    {label && <span className="font-medium text-foreground">{label}: </span>}
                                    {text}
                                 </p>
                              </div>
                           );
                        }

                        // Standard Text
                        return (
                           <p key={idx} className="text-muted-foreground leading-relaxed">
                              {trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').split(/<strong>|<\/strong>/).map((part, i) => 
                                 i % 2 === 0 ? part : <strong key={i} className="font-medium text-foreground">{part}</strong>
                              )}
                           </p>
                        );
                     })}
                  </div>
               </div>
             )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
