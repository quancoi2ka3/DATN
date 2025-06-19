using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SunMovement.Core.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ArticleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Article>> GetAllArticlesAsync()
        {
            return await _unitOfWork.Articles.GetAllAsync();
        }

        public async Task<Article?> GetArticleByIdAsync(int id)
        {
            return await _unitOfWork.Articles.GetByIdAsync(id);
        }

        public async Task<Article?> GetArticleBySlugAsync(string slug)
        {
            return await _unitOfWork.Articles.GetArticleBySlugAsync(slug);
        }

        public async Task<IEnumerable<Article>> GetPublishedArticlesAsync()
        {
            return await _unitOfWork.Articles.GetPublishedArticlesAsync();
        }

        public async Task<IEnumerable<Article>> GetArticlesByTypeAsync(ArticleType type)
        {
            return await _unitOfWork.Articles.GetArticlesByTypeAsync(type);
        }

        public async Task<IEnumerable<Article>> GetArticlesByCategoryAsync(ArticleCategory category)
        {
            return await _unitOfWork.Articles.GetArticlesByCategoryAsync(category);
        }

        public async Task<IEnumerable<Article>> GetFeaturedArticlesAsync()
        {
            return await _unitOfWork.Articles.GetFeaturedArticlesAsync();
        }

        public async Task<IEnumerable<Article>> SearchArticlesAsync(string query)
        {
            return await _unitOfWork.Articles.SearchArticlesAsync(query);
        }

        public async Task<IEnumerable<Article>> GetRecentArticlesAsync(int count = 5)
        {
            return await _unitOfWork.Articles.GetRecentArticlesAsync(count);
        }

        public async Task<IEnumerable<Article>> GetRelatedArticlesAsync(int articleId, ArticleCategory category, int count = 3)
        {
            return await _unitOfWork.Articles.GetRelatedArticlesAsync(articleId, category, count);
        }

        public async Task<IEnumerable<Article>> GetArticlesByTypeAndCategoryAsync(ArticleType type, ArticleCategory category)
        {
            return await _unitOfWork.Articles.GetArticlesByTypeAndCategoryAsync(type, category);
        }

        public async Task<Article> CreateArticleAsync(Article article)
        {
            // Generate slug if not provided
            if (string.IsNullOrWhiteSpace(article.Slug))
            {
                article.Slug = GenerateSlug(article.Title);
            }

            // Ensure slug is unique
            var existingArticle = await _unitOfWork.Articles.GetArticleBySlugAsync(article.Slug);
            if (existingArticle != null)
            {
                article.Slug = $"{article.Slug}-{DateTime.UtcNow.Ticks}";
            }

            article.CreatedAt = DateTime.UtcNow;
            
            // Set published date if article is being published
            if (article.IsPublished && !article.PublishedAt.HasValue)
            {
                article.PublishedAt = DateTime.UtcNow;
            }

            await _unitOfWork.Articles.AddAsync(article);
            await _unitOfWork.CompleteAsync();
            
            return article;
        }

        public async Task<Article> UpdateArticleAsync(Article article)
        {
            var existingArticle = await _unitOfWork.Articles.GetByIdAsync(article.Id);
            if (existingArticle == null)
            {
                throw new ArgumentException("Article not found");
            }

            // Update properties
            existingArticle.Title = article.Title;
            existingArticle.Content = article.Content;
            existingArticle.Summary = article.Summary;
            existingArticle.ImageUrl = article.ImageUrl;
            existingArticle.Type = article.Type;
            existingArticle.Category = article.Category;
            existingArticle.Tags = article.Tags;
            existingArticle.Author = article.Author;
            existingArticle.MetaDescription = article.MetaDescription;
            existingArticle.MetaKeywords = article.MetaKeywords;
            existingArticle.DisplayOrder = article.DisplayOrder;
            existingArticle.UpdatedAt = DateTime.UtcNow;

            // Handle slug update
            if (!string.IsNullOrWhiteSpace(article.Slug) && article.Slug != existingArticle.Slug)
            {
                var slugExists = await _unitOfWork.Articles.GetArticleBySlugAsync(article.Slug);
                if (slugExists == null || slugExists.Id == article.Id)
                {
                    existingArticle.Slug = article.Slug;
                }
            }

            // Handle publishing status
            var wasPublished = existingArticle.IsPublished;
            existingArticle.IsPublished = article.IsPublished;
            existingArticle.IsFeatured = article.IsFeatured;

            // Set published date if article is being published for the first time
            if (article.IsPublished && !wasPublished && !existingArticle.PublishedAt.HasValue)
            {
                existingArticle.PublishedAt = DateTime.UtcNow;
            }
            // Clear published date if unpublishing
            else if (!article.IsPublished && wasPublished)
            {
                existingArticle.PublishedAt = null;
            }

            await _unitOfWork.Articles.UpdateAsync(existingArticle);
            await _unitOfWork.CompleteAsync();
            
            return existingArticle;
        }

        public async Task DeleteArticleAsync(int id)
        {
            var article = await _unitOfWork.Articles.GetByIdAsync(id);
            if (article != null)
            {
                await _unitOfWork.Articles.DeleteAsync(article);
                await _unitOfWork.CompleteAsync();
            }
        }

        public async Task<Article> PublishArticleAsync(int id)
        {
            var article = await _unitOfWork.Articles.GetByIdAsync(id);
            if (article == null)
            {
                throw new ArgumentException("Article not found");
            }

            article.IsPublished = true;
            if (!article.PublishedAt.HasValue)
            {
                article.PublishedAt = DateTime.UtcNow;
            }
            article.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Articles.UpdateAsync(article);
            await _unitOfWork.CompleteAsync();
            
            return article;
        }

        public async Task<Article> UnpublishArticleAsync(int id)
        {
            var article = await _unitOfWork.Articles.GetByIdAsync(id);
            if (article == null)
            {
                throw new ArgumentException("Article not found");
            }

            article.IsPublished = false;
            article.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Articles.UpdateAsync(article);
            await _unitOfWork.CompleteAsync();
            
            return article;
        }

        public async Task IncrementViewCountAsync(int id)
        {
            await _unitOfWork.Articles.IncrementViewCountAsync(id);
        }

        public string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return string.Empty;

            // Convert to lowercase
            string slug = title.ToLowerInvariant();

            // Remove Vietnamese accents
            slug = RemoveVietnameseAccents(slug);

            // Replace spaces and special characters with hyphens
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = Regex.Replace(slug, @"-+", "-");

            // Remove leading/trailing hyphens
            slug = slug.Trim('-');

            // Limit length
            if (slug.Length > 100)
            {
                slug = slug.Substring(0, 100).TrimEnd('-');
            }

            return slug;
        }

        private static string RemoveVietnameseAccents(string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
