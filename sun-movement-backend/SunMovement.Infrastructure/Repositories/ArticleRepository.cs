using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Infrastructure.Repositories
{
    public class ArticleRepository : Repository<Article>, IArticleRepository
    {
        public ArticleRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Article>> GetPublishedArticlesAsync()
        {
            return await _context.Articles
                .Where(a => a.IsPublished && a.PublishedAt <= DateTime.UtcNow)
                .OrderByDescending(a => a.PublishedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetArticlesByTypeAsync(ArticleType type)
        {
            return await _context.Articles
                .Where(a => a.Type == type && a.IsPublished)
                .OrderByDescending(a => a.PublishedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetArticlesByCategoryAsync(ArticleCategory category)
        {
            return await _context.Articles
                .Where(a => a.Category == category && a.IsPublished)
                .OrderByDescending(a => a.PublishedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetFeaturedArticlesAsync()
        {
            return await _context.Articles
                .Where(a => a.IsFeatured && a.IsPublished)
                .OrderBy(a => a.DisplayOrder)
                .ThenByDescending(a => a.PublishedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> SearchArticlesAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return await GetPublishedArticlesAsync();
            }

            return await _context.Articles
                .Where(a => a.IsPublished &&
                           (a.Title.Contains(query) ||
                            a.Content.Contains(query) ||
                            a.Summary!.Contains(query) ||
                            a.Tags!.Contains(query)))
                .OrderByDescending(a => a.PublishedAt)
                .ToListAsync();
        }

        public async Task<Article?> GetArticleBySlugAsync(string slug)
        {
            return await _context.Articles
                .FirstOrDefaultAsync(a => a.Slug == slug && a.IsPublished);
        }

        public async Task<IEnumerable<Article>> GetRecentArticlesAsync(int count = 5)
        {
            return await _context.Articles
                .Where(a => a.IsPublished)
                .OrderByDescending(a => a.PublishedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> GetRelatedArticlesAsync(int articleId, ArticleCategory category, int count = 3)
        {
            return await _context.Articles
                .Where(a => a.Id != articleId && 
                           a.Category == category && 
                           a.IsPublished)
                .OrderByDescending(a => a.PublishedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task IncrementViewCountAsync(int articleId)
        {
            var article = await _context.Articles.FindAsync(articleId);
            if (article != null)
            {
                article.ViewCount++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Article>> GetArticlesByTypeAndCategoryAsync(ArticleType type, ArticleCategory category)
        {
            return await _context.Articles
                .Where(a => a.Type == type && a.Category == category && a.IsPublished)
                .OrderBy(a => a.DisplayOrder)
                .ThenByDescending(a => a.PublishedAt)
                .ToListAsync();
        }
    }
}
