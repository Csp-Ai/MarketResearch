import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import ResultsDisplay from '../components/landing/ResultsDisplay';
import { useAnalysis } from '../hooks/useAnalysis';

export default function LandingPage() {
  const { scrapingResult, isAnalyzing, currentStep, analysisLog, error, scrapedContent, showScrapedContent, startAnalysis } = useAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-950 dark:text-white">
      <Header />
      
      {/* Main Content */}
      <div className="pt-16">
        <Hero 
          isAnalyzing={isAnalyzing}
          currentStep={currentStep}
          analysisLog={analysisLog}
          error={error}
          scrapedContent={scrapedContent}
          showScrapedContent={showScrapedContent}
          startAnalysis={startAnalysis}
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