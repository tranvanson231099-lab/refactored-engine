import React, { useState, useEffect } from 'react';
import { smartTypingSuggestions, SmartTypingSuggestionsOutput } from '@/ai/flows/smart-typing-suggestions-flow';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingSuggestionsProps {
  text: string;
  onSuggestionClick: (suggestion: string) => void;
  isAiEnabled: boolean;
  isOnline: boolean;
}

export const TypingSuggestions: React.FC<TypingSuggestionsProps> = ({ 
  text, 
  onSuggestionClick,
  isAiEnabled,
  isOnline 
}) => {
  const [suggestions, setSuggestions] = useState<SmartTypingSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAiEnabled || !isOnline) {
      setSuggestions(null);
      return;
    }

    const timer = setTimeout(async () => {
      const words = text.trim().split(' ');
      const lastWord = words[words.length - 1] || '';
      
      if (lastWord.length > 1) {
        setIsLoading(true);
        try {
          const result = await smartTypingSuggestions({
            currentInput: lastWord,
            fullSentenceContext: text
          });
          setSuggestions(result);
        } catch (error) {
          console.error('Suggestion error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions(null);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [text, isAiEnabled, isOnline]);

  if (!isAiEnabled) return null;

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border text-muted-foreground">
        <CloudOff className="w-4 h-4" />
        <span className="text-xs font-medium">AI Offline mode. Connect to internet for smart suggestions.</span>
      </div>
    );
  }

  if (!suggestions || (!suggestions.wordCompletions.length && !suggestions.toneMarkCorrections.length)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-top-1">
      <div className="flex items-center gap-1.5 text-xs font-bold text-primary mr-2 uppercase tracking-widest">
        <Sparkles className="w-3.5 h-3.5" />
        AI Insights
      </div>
      
      {suggestions.wordCompletions.map((word, i) => (
        <button
          key={`comp-${i}`}
          onClick={() => onSuggestionClick(word)}
          className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-accent hover:text-white transition-all rounded-full border border-primary/20 text-sm font-medium shadow-sm group"
        >
          {word}
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}

      {suggestions.toneMarkCorrections.map((word, i) => (
        <button
          key={`tone-${i}`}
          onClick={() => onSuggestionClick(word)}
          className="px-3 py-1 bg-accent/10 hover:bg-accent hover:text-white transition-all rounded-full border border-accent/30 text-sm font-medium text-accent hover:border-accent group italic"
        >
          {word}
        </button>
      ))}

      {isLoading && <div className="ml-auto animate-pulse text-[10px] text-muted-foreground uppercase font-bold">Analysing context...</div>}
    </div>
  );
};
