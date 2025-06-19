using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface IArticleRepository : IRepository<Article>
    {
        Task<IEnumerable<Article>> GetPublishedArticlesAsync();
        Task<IEnumerable<Article>> GetArticlesByTypeAsync(ArticleType type);
        Task<IEnumerable<Article>> GetArticlesByCategoryAsync(ArticleCategory category);
        Task<IEnumerable<Article>> GetFeaturedArticlesAsync();
        Task<IEnumerable<Article>> SearchArticlesAsync(string query);
        Task<Article?> GetArticleBySlugAsync(string slug);
        Task<IEnumerable<Article>> GetRecentArticlesAsync(int count = 5);
        Task<IEnumerable<Article>> GetRelatedArticlesAsync(int articleId, ArticleCategory category, int count = 3);
        Task IncrementViewCountAsync(int articleId);
        Task<IEnumerable<Article>> GetArticlesByTypeAndCategoryAsync(ArticleType type, ArticleCategory category);
    }
}
