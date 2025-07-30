import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import ResultsDisplay from '../components/landing/ResultsDisplay';
import { useAnalysis } from '../hooks/useAnalysis';

export default function LandingPage() {
  const { 
    scrapingResult, 
    isAnalyzing, 
    isDiscovering,
    isUrlSelecting,
    isScraping,
    isAnalyzingPhase,
    currentPhase, 
    analysisLog, 
    error, 
    scrapedContent, 
    showScrapedContent, 
    startAnalysis,
    urlSelectionState,
    showUrlSelection,
    scrapeProgress,
    analysisProgress,
    handleUrlsSelected,
    handleBackToUrlSelection,
    cleanup
  } = useAnalysis();

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-950 dark:text-white">
      <Header />
      
      {/* Main Content */}
      <div className="pt-16">
        <Hero 
          isAnalyzing={isAnalyzing}
          isDiscovering={isDiscovering}
          isUrlSelecting={isUrlSelecting}
          isScraping={isScraping}
          isAnalyzingPhase={isAnalyzingPhase}
          currentPhase={currentPhase}
          analysisLog={analysisLog}
          error={error}
          scrapedContent={scrapedContent}
          showScrapedContent={showScrapedContent}
          startAnalysis={startAnalysis}
          urlSelectionState={urlSelectionState}
          showUrlSelection={showUrlSelection}
          scrapeProgress={scrapeProgress}
          analysisProgress={analysisProgress}
          handleUrlsSelected={handleUrlsSelected}
          handleBackToUrlSelection={handleBackToUrlSelection}
        />
        
        {/* Results Section */}
        {scrapingResult && (
          <ResultsDisplay scrapingResult={scrapingResult} />
        )}
      </div>
      
      <Footer />
    </div>
  );
} 