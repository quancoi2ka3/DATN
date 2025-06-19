using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunMovement.Core.DTOs;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Web.Areas.Api.Controllers
{
    [Area("Api")]
    [Route("api/articles")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        // GET: api/articles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticles()
        {
            var articles = await _articleService.GetAllArticlesAsync();
            var articleDtos = articles.Select(MapToDto);
            return Ok(articleDtos);
        }

        // GET: api/articles/published
        [HttpGet("published")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetPublishedArticles()
        {
            var articles = await _articleService.GetPublishedArticlesAsync();
            var articleDtos = articles.Select(MapToDto);
            return Ok(articleDtos);
        }

        // GET: api/articles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDto>> GetArticle(int id)
        {
            var article = await _articleService.GetArticleByIdAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            // Increment view count for published articles
            if (article.IsPublished)
            {
                await _articleService.IncrementViewCountAsync(id);
            }

            return MapToDto(article);
        }

        // GET: api/articles/slug/my-article-slug
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<ArticleDto>> GetArticleBySlug(string slug)
        {
            var article = await _articleService.GetArticleBySlugAsync(slug);
            if (article == null || !article.IsPublished)
            {
                return NotFound();
            }

            // Increment view count
            await _articleService.IncrementViewCountAsync(article.Id);

            return MapToDto(article);
        }

        // GET: api/articles/type/blog
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticlesByType(string type)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(type))
                {
                    return BadRequest("Type cannot be empty");
                }

                if (!Enum.TryParse<ArticleType>(type, ignoreCase: true, out var articleType))
                {
                    return BadRequest($"Invalid article type: {type}. Available types: {string.Join(", ", Enum.GetNames(typeof(ArticleType)))}");
                }

                var articles = await _articleService.GetArticlesByTypeAsync(articleType);
                var articleDtos = articles.Select(MapToDto);
                return Ok(articleDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/articles/category/homepage
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticlesByCategory(string category)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(category))
                {
                    return BadRequest("Category cannot be empty");
                }

                if (!Enum.TryParse<ArticleCategory>(category, ignoreCase: true, out var articleCategory))
                {
                    return BadRequest($"Invalid article category: {category}. Available categories: {string.Join(", ", Enum.GetNames(typeof(ArticleCategory)))}");
                }

                var articles = await _articleService.GetArticlesByCategoryAsync(articleCategory);
                var articleDtos = articles.Select(MapToDto);
                return Ok(articleDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/articles/type/blog/category/homepage
        [HttpGet("type/{type}/category/{category}")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticlesByTypeAndCategory(string type, string category)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(type) || string.IsNullOrWhiteSpace(category))
                {
                    return BadRequest("Type and category cannot be empty");
                }

                if (!Enum.TryParse<ArticleType>(type, ignoreCase: true, out var articleType))
                {
                    return BadRequest($"Invalid article type: {type}");
                }

                if (!Enum.TryParse<ArticleCategory>(category, ignoreCase: true, out var articleCategory))
                {
                    return BadRequest($"Invalid article category: {category}");
                }

                var articles = await _articleService.GetArticlesByTypeAndCategoryAsync(articleType, articleCategory);
                var articleDtos = articles.Select(MapToDto);
                return Ok(articleDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/articles/featured
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> GetFeaturedArticles()
        {
            var articles = await _articleService.GetFeaturedArticlesAsync();
            var articleDtos = articles.Select(MapToDto);
            return Ok(articleDtos);
        }

        // GET: api/articles/search?q=searchTerm
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ArticleDto>>> SearchArticles([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
            {
                return BadRequest("Search query cannot be empty");
            }

            var articles = await _articleService.SearchArticlesAsync(q);
            var articleDtos = articles.Select(MapToDto);
            return Ok(articleDtos);
        }

        // POST: api/articles
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ArticleDto>> CreateArticle([FromBody] CreateArticleDto createArticleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var article = MapFromCreateDto(createArticleDto);
                var createdArticle = await _articleService.CreateArticleAsync(article);
                
                return CreatedAtAction(nameof(GetArticle), new { id = createdArticle.Id }, MapToDto(createdArticle));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/articles/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateArticle(int id, [FromBody] UpdateArticleDto updateArticleDto)
        {
            try
            {
                if (id != updateArticleDto.Id)
                {
                    return BadRequest("Article ID mismatch");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingArticle = await _articleService.GetArticleByIdAsync(id);
                if (existingArticle == null)
                {
                    return NotFound();
                }

                var article = MapFromUpdateDto(updateArticleDto, existingArticle);
                await _articleService.UpdateArticleAsync(article);
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/articles/5/publish
        [HttpPost("{id}/publish")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PublishArticle(int id)
        {
            try
            {
                var article = await _articleService.PublishArticleAsync(id);
                if (article == null)
                {
                    return NotFound();
                }

                return Ok(MapToDto(article));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/articles/5/unpublish
        [HttpPost("{id}/unpublish")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnpublishArticle(int id)
        {
            try
            {
                var article = await _articleService.GetArticleByIdAsync(id);
                if (article == null)
                {
                    return NotFound();
                }

                article.IsPublished = false;
                article.PublishedAt = null;
                article.UpdatedAt = DateTime.UtcNow;

                await _articleService.UpdateArticleAsync(article);
                return Ok(MapToDto(article));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/articles/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            try
            {
                var article = await _articleService.GetArticleByIdAsync(id);
                if (article == null)
                {
                    return NotFound();
                }

                await _articleService.DeleteArticleAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Utility methods for mapping between entities and DTOs
        private ArticleDto MapToDto(Article article)
        {
            // Convert relative image URLs to absolute URLs
            string imageUrl = string.Empty;
            if (!string.IsNullOrEmpty(article.ImageUrl))
            {
                if (article.ImageUrl.StartsWith("http"))
                {
                    // Already an absolute URL
                    imageUrl = article.ImageUrl;
                }
                else
                {
                    // Convert relative URL to absolute URL
                    var scheme = Request.Scheme;
                    var host = Request.Host;
                    imageUrl = $"{scheme}://{host}{article.ImageUrl}";
                }
            }

            return new ArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Content = article.Content,
                Summary = article.Summary,
                Slug = article.Slug,
                ImageUrl = imageUrl,
                Type = article.Type,
                Category = article.Category,
                Tags = article.Tags ?? string.Empty,
                Author = article.Author ?? string.Empty,
                IsPublished = article.IsPublished,
                IsFeatured = article.IsFeatured,
                PublishedAt = article.PublishedAt,
                DisplayOrder = article.DisplayOrder,
                ViewCount = article.ViewCount,
                MetaTitle = article.MetaTitle ?? string.Empty,
                MetaDescription = article.MetaDescription ?? string.Empty,
                MetaKeywords = article.MetaKeywords ?? string.Empty,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt
            };
        }

        private Article MapFromCreateDto(CreateArticleDto dto)
        {
            return new Article
            {
                Title = dto.Title,
                Content = dto.Content,
                Summary = dto.Summary ?? string.Empty,
                ImageUrl = dto.ImageUrl,
                Type = dto.Type,
                Category = dto.Category,
                Tags = dto.Tags ?? string.Empty,
                Author = dto.Author ?? string.Empty,
                IsPublished = dto.IsPublished,
                IsFeatured = dto.IsFeatured,
                DisplayOrder = dto.DisplayOrder,
                MetaTitle = dto.MetaTitle ?? string.Empty,
                MetaDescription = dto.MetaDescription ?? string.Empty,
                MetaKeywords = dto.MetaKeywords ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        private Article MapFromUpdateDto(UpdateArticleDto dto, Article existingArticle)
        {
            existingArticle.Title = dto.Title;
            existingArticle.Content = dto.Content;
            existingArticle.Summary = dto.Summary ?? string.Empty;
            existingArticle.ImageUrl = dto.ImageUrl;
            existingArticle.Type = dto.Type;
            existingArticle.Category = dto.Category;
            existingArticle.Tags = dto.Tags ?? string.Empty;
            existingArticle.Author = dto.Author ?? string.Empty;
            existingArticle.IsPublished = dto.IsPublished;
            existingArticle.IsFeatured = dto.IsFeatured;
            existingArticle.DisplayOrder = dto.DisplayOrder;
            existingArticle.MetaTitle = dto.MetaTitle ?? string.Empty;
            existingArticle.MetaDescription = dto.MetaDescription ?? string.Empty;
            existingArticle.MetaKeywords = dto.MetaKeywords ?? string.Empty;
            existingArticle.UpdatedAt = DateTime.UtcNow;

            return existingArticle;
        }
    }
}
