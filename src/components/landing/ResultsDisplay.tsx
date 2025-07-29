import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Globe, 
  Star, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Bot, 
  Target, 
  BarChart, 
  MessageSquare, 
  Eye, 
  Play, 
  UserCheck 
} from 'lucide-react';
import { ScrapingResult } from '../../types/analysis';

interface ResultsDisplayProps {
  scrapingResult: ScrapingResult;
}

export default function ResultsDisplay({ scrapingResult }: ResultsDisplayProps) {
  const [renderedChunks, setRenderedChunks] = useState<string[]>([]);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    if (!scrapingResult?.combined_text_content) {
      setIsRendering(false);
      return;
    }

    // Show full content in one piece for easy copying
    const content = scrapingResult.combined_text_content.replace(/"/g, '');
    setRenderedChunks([content]); // Single chunk with all content
    setIsRendering(false);
  }, [scrapingResult]);

  const renderList = (items: string[] | undefined, fallbackText: string = "Not available") => {
    if (!items || items.length === 0) {
      return (
        <li className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="text-gray-400">{fallbackText}</span>
        </li>
      );
    }
    
    return items.map((item, idx) => (
      <li key={idx} className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-400" /> <span className="text-gray-300">{item}</span>
      </li>
    ));
  };

  const renderContentChunks = () => {
    // Show full content in one piece for easy copying
    return renderedChunks.map((chunk, index) => (
      <div key={index} className="mb-3 p-3 bg-dark-700 rounded border border-gray-600">
        <div className="text-xs text-gray-400 mb-2 font-medium flex justify-between items-center">
          <span>Complete Scraped Content ({chunk.length.toLocaleString()} characters)</span>
          <button
            onClick={() => navigator.clipboard.writeText(chunk)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
          >
            Copy All
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-xs text-gray-300 select-all">{chunk}</pre>
      </div>
    ));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center flex items-center justify-center gap-2">
        <BarChart3 className="inline-block h-8 w-8 text-blue-400" />
        Your AI Market Research Blueprint
      </h2>
      <p className="text-lg text-gray-300 text-center mb-10">
        Actionable insights and opportunities for your business, powered by AI.
      </p>
      
      {/* All Scraped Content */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-gray-700 mb-10 shadow-md">
        <div className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          All Scraped Content (Combined)
          <span className="text-sm text-gray-400">
            ({scrapingResult.combined_text_content.length.toLocaleString()} characters)
          </span>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {isRendering ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-gray-400">Processing content for display...</div>
            </div>
          ) : (
            renderContentChunks()
          )}
        </div>
      </div>
      
      {/* Modern Grouped Report */}
      <div className="space-y-12">
        {/* Group 1: Business Overview */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-400" /> Business Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Overview */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Company Overview</span>
              </div>
              <p className="text-gray-300">
                {scrapingResult.analysisReport.company_overview || 
                  <span className="text-gray-500 flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Not available
                  </span>
                }
              </p>
            </div>
            
            {/* Key Offerings */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-6 w-6 text-yellow-400" />
                <span className="text-xl font-bold text-white">Key Offerings</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.key_offerings_or_products)}
              </ul>
            </div>
            
            {/* Target Customer Segments */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold text-white">Target Segments</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.target_customer_segments)}
              </ul>
            </div>
            
            {/* Unique Selling Points */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold text-white">Unique Selling Points</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.unique_selling_points)}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Group 2: Market & Competition */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart className="h-6 w-6 text-blue-400" /> Market & Competition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Industry and Market Trends */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-orange-400" />
                <span className="text-xl font-bold text-white">Industry & Market Trends</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.industry_and_market_trends)}
              </ul>
            </div>
            
            {/* Competitive Landscape */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">Competitive Landscape</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.competitive_landscape)}
              </ul>
            </div>
            
            {/* Customer Testimonials */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold text-white">Customer Testimonials</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.customer_testimonials)}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Group 3: AI & Tech */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-400" /> AI & Technology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opportunities for Using AI */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Opportunities for Using AI</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.opportunities_for_using_ai)}
              </ul>
            </div>
            
            {/* Technology Stack Overview */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Technology Stack</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.technology_stack_overview)}
              </ul>
            </div>
            
            {/* Data Requirements and Risks */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-6 w-6 text-red-400" />
                <span className="text-xl font-bold text-white">Data Requirements & Risks</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.data_requirements_and_risks)}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Group 4: Action Plan */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-400" /> Action Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Suggested Next Steps for AI Adoption */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Next Steps for AI Adoption</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.suggested_next_steps_for_ai_adoption)}
              </ul>
            </div>
            
            {/* Actionable Recommendations */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold text-white">Actionable Recommendations</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.actionable_recommendations)}
              </ul>
            </div>
            
            {/* Team AI Readiness */}
            <div className="bg-dark-800 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Team AI Readiness</span>
              </div>
              <p className="text-gray-300">
                {scrapingResult.analysisReport.team_ai_readiness || 
                  <span className="text-gray-500 flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Not available
                  </span>
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 