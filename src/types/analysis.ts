export interface RecommendedAIUseCases {
  short_term: string[];
  medium_term: string[];
  long_term: string[];
}

export interface AnalysisReport {
  company_overview: string;
  key_offerings_or_products: string[];
  target_customer_segments: string[];
  unique_selling_points: string[];
  industry_and_market_trends: string[];
  potential_business_challenges: string[];
  opportunities_for_using_ai: string[];
  recommended_ai_use_cases: RecommendedAIUseCases;
  data_requirements_and_risks: string[];
  suggested_next_steps_for_ai_adoption: string[];
  customer_journey_mapping: string;
  digital_maturity_assessment: string;
  technology_stack_overview: string[];
  partnerships_and_alliances: string[];
  sustainability_and_social_responsibility: string;
  financial_overview: string;
  actionable_recommendations: string[];
  competitive_landscape: string[];
  customer_testimonials: string[];
  quantitative_opportunity_metrics: string[];
  content_inventory: string[];
  ai_maturity_level: string;
  data_sources_reviewed: string[];
  business_stage: string;
  branding_tone: string;
  visual_opportunities: string[];
  team_ai_readiness: string;
}

export interface ScrapingResult {
  original_url: string;
  total_urls_discovered: number;
  total_urls_scraped: number;
  scrape_time: number;
  all_scraped_data: any[];
  all_content: any[];
  combined_text_content: string;
  extracted_info: {
    total_pages: number;
    total_words: number;
    unique_products: string[];
    contact_info: string[];
    pricing_info: string[];
    business_description: string;
    key_features: string[];
  };
  main_page: any;
  linked_pages: any[];
  total_pages_scraped: number;
  unique_urls_visited: number;
  analysisReport: AnalysisReport;
}

export interface AnalysisHistory {
  id: string;
  business_id: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  title: string;
  analysis_report?: AnalysisReport;
} 