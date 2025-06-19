export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  imageUrl: string;
  type: number;
  category: number;
  tags: string;
  author: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string;
  displayOrder: number;
  viewCount: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  count?: number;
}

class ArticleService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001';
    console.log('ArticleService initialized with baseUrl:', this.baseUrl);
    console.log('Environment NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  }

  async getAllArticles(): Promise<Article[]> {
    try {
      const url = `${this.baseUrl}/api/articles/published`;
      console.log('Fetching articles from:', url);
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Articles fetched successfully:', data.length, 'articles');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  async getArticleById(id: number): Promise<Article | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/articles/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching article:', error);
      return null;
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/articles/slug/${slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }
  }

  // Get articles by numeric category ID
  async getArticlesByCategoryId(categoryId: number): Promise<Article[]> {
    try {
      const url = `${this.baseUrl}/api/articles/category/${categoryId}`;
      console.log('Fetching articles by category ID from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Articles by category response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Articles by category fetched successfully:', data.length, 'articles');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching articles by category ID:', error);
      return [];
    }
  }

  async getArticlesByType(type: string): Promise<Article[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/articles/type/${type}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching articles by type:', error);
      return [];
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    try {
      const url = `${this.baseUrl}/api/articles/search?q=${encodeURIComponent(query)}`;
      console.log('Searching articles with URL:', url);
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('Search response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Search results:', data.length, 'articles found for query:', query);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/articles/featured`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return [];
    }
  }

  // Helper method to get yoga-related articles
  async getYogaArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(10); // Yoga = 10
  }

  // Helper method to get calisthenics-related articles  
  async getCalisthenicsArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(9); // Calisthenics = 9
  }

  // Helper method to get strength training articles
  async getStrengthTrainingArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(11); // StrengthTraining = 11
  }

  // Helper method to get nutrition articles
  async getNutritionArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(8); // Nutrition = 8
  }

  // Helper method to get workout guides
  async getWorkoutGuidesArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(7); // WorkoutGuides = 7
  }

  // Helper method to get customer reviews/testimonials
  async getTestimonialsArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(12); // CustomerReviews = 12
  }

  // Helper method to get homepage articles
  async getHomepageArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(1); // Homepage = 1
  }

  // Helper method to get about articles
  async getAboutArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(2); // About = 2
  }

  // Helper method to get services articles
  async getServicesArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(3); // Services = 3
  }

  // Helper method to get products articles
  async getProductsArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(4); // Products = 4
  }

  // Helper method to get events articles
  async getEventsArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(5); // Events = 5
  }

  // Helper method to get news articles
  async getNewsArticles(): Promise<Article[]> {
    return this.getArticlesByCategoryId(6); // News = 6
  }

  // Helper method to strip HTML tags from content for preview
  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // Helper method to truncate text for previews
  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  }

  // Helper method to get clean preview text
  getPreviewText(article: Article, maxLength: number = 150): string {
    const text = article.summary || this.stripHtml(article.content);
    return this.truncateText(text, maxLength);
  }
}

export const articleService = new ArticleService();
export default articleService;

