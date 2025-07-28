import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import AnalysisForm from '../components/landing/AnalysisForm';
import ResultsDisplay from '../components/landing/ResultsDisplay';
import AgentCards from '../components/landing/AgentCards';
import { useAnalysis } from '../hooks/useAnalysis';

export default function LandingPage() {
  const { scrapingResult, isAnalyzing, currentStep, analysisLog, error, scrapedContent, showScrapedContent, startAnalysis } = useAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-100 to-white">
      <Header />
      
      {/* Main Content */}
      <div className="pt-16">
        <Hero />
        
        {/* Analysis Form Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnalysisForm 
            isAnalyzing={isAnalyzing}
            currentStep={currentStep}
            analysisLog={analysisLog}
            error={error}
            scrapedContent={scrapedContent}
            showScrapedContent={showScrapedContent}
            startAnalysis={startAnalysis}
          />
        </section>
        
        {/* Results Section */}
        {scrapingResult && (
          <ResultsDisplay scrapingResult={scrapingResult} />
        )}
        
        {/* Agent Cards Section */}
        <AgentCards />
      </div>
      
      <Footer />
    </div>
  );
} 