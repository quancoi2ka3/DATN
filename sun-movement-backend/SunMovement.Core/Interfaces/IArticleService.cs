using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SunMovement.Core.Interfaces
{
    public interface IArticleService
    {
        Task<IEnumerable<Article>> GetAllArticlesAsync();
        Task<Article?> GetArticleByIdAsync(int id);
        Task<Article?> GetArticleBySlugAsync(string slug);
        Task<IEnumerable<Article>> GetPublishedArticlesAsync();
        Task<IEnumerable<Article>> GetArticlesByTypeAsync(ArticleType type);
        Task<IEnumerable<Article>> GetArticlesByCategoryAsync(ArticleCategory category);
        Task<IEnumerable<Article>> GetFeaturedArticlesAsync();
        Task<IEnumerable<Article>> SearchArticlesAsync(string query);
        Task<IEnumerable<Article>> GetRecentArticlesAsync(int count = 5);
        Task<IEnumerable<Article>> GetRelatedArticlesAsync(int articleId, ArticleCategory category, int count = 3);
        Task<IEnumerable<Article>> GetArticlesByTypeAndCategoryAsync(ArticleType type, ArticleCategory category);
        Task<Article> CreateArticleAsync(Article article);
        Task<Article> UpdateArticleAsync(Article article);
        Task DeleteArticleAsync(int id);
        Task<Article> PublishArticleAsync(int id);
        Task<Article> UnpublishArticleAsync(int id);
        Task IncrementViewCountAsync(int id);
        string GenerateSlug(string title);
    }
}
