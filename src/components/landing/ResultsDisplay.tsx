import React from 'react';
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
  const renderList = (items: string[] | undefined, fallbackText: string = "Not available") => {
    if (!items || items.length === 0) {
      return (
        <li className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">{fallbackText}</span>
        </li>
      );
    }
    
    return items.map((item, idx) => (
      <li key={idx} className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-500" /> {item}
      </li>
    ));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2 text-center flex items-center justify-center gap-2">
        <BarChart3 className="inline-block h-8 w-8 text-blue-500" />
        Your AI Market Research Blueprint
      </h2>
      <p className="text-lg text-blue-700 text-center mb-10">
        Actionable insights and opportunities for your business, powered by AI.
      </p>
      
      {/* All Scraped Content */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-10 shadow-md">
        <div className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          All Scraped Content (Combined)
        </div>
        <div className="bg-gray-50 rounded p-3 text-sm font-mono max-h-96 overflow-y-auto border">
          <pre className="whitespace-pre-wrap text-xs">{scrapingResult.combined_text_content.replace(/"/g, '')}</pre>
        </div>
      </div>
      
      {/* Modern Grouped Report */}
      <div className="space-y-12">
        {/* Group 1: Business Overview */}
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-400" /> Business Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-blue-800">Company Overview</span>
              </div>
              <p className="text-gray-700">
                {scrapingResult.analysisReport.company_overview || 
                  <span className="text-gray-400 flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Not available
                  </span>
                }
              </p>
            </div>
            
            {/* Key Offerings */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-bold text-blue-800">Key Offerings</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.key_offerings_or_products)}
              </ul>
            </div>
            
            {/* Target Customer Segments */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold text-blue-800">Target Segments</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.target_customer_segments)}
              </ul>
            </div>
            
            {/* Unique Selling Points */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold text-blue-800">Unique Selling Points</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.unique_selling_points)}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Group 2: Market & Competition */}
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <BarChart className="h-6 w-6 text-blue-400" /> Market & Competition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Industry and Market Trends */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-orange-500" />
                <span className="text-xl font-bold text-blue-800">Industry & Market Trends</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.industry_and_market_trends)}
              </ul>
            </div>
            
            {/* Competitive Landscape */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold text-blue-800">Competitive Landscape</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.competitive_landscape)}
              </ul>
            </div>
            
            {/* Customer Testimonials */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold text-blue-800">Customer Testimonials</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.customer_testimonials)}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Group 3: AI & Tech */}
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-400" /> AI & Technology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opportunities for Using AI */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-blue-800">Opportunities for Using AI</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.opportunities_for_using_ai)}
              </ul>
            </div>
            
            {/* Technology Stack Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-blue-800">Technology Stack</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.technology_stack_overview)}
              </ul>
            </div>
            
            {/* Data Requirements and Risks */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-6 w-6 text-red-400" />
                <span className="text-xl font-bold text-blue-800">Data Requirements & Risks</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.data_requirements_and_risks)}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Group 4: Action Plan */}
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" /> Action Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Suggested Next Steps for AI Adoption */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-blue-800">Next Steps for AI Adoption</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.suggested_next_steps_for_ai_adoption)}
              </ul>
            </div>
            
            {/* Actionable Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-green-600" />
                <span className="text-xl font-bold text-blue-800">Actionable Recommendations</span>
              </div>
              <ul className="list-none space-y-1">
                {renderList(scrapingResult.analysisReport.actionable_recommendations)}
              </ul>
            </div>
            
            {/* Team AI Readiness */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition-transform duration-200 hover:scale-[1.03]">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-blue-800">Team AI Readiness</span>
              </div>
              <p className="text-gray-700">
                {scrapingResult.analysisReport.team_ai_readiness || 
                  <span className="text-gray-400 flex items-center gap-1">
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