using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;
using SunMovement.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SunMovement.Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ArticlesAdminController : Controller
    {
        private readonly IArticleService _articleService;
        private readonly IFileUploadService _fileUploadService;

        public ArticlesAdminController(IArticleService articleService, IFileUploadService fileUploadService)
        {
            _articleService = articleService;
            _fileUploadService = fileUploadService;
        }

        // GET: Admin/ArticlesAdmin
        public async Task<IActionResult> Index(string searchString, ArticleType? type, ArticleCategory? category, bool? isPublished, int page = 1, int pageSize = 10)
        {
            try
            {
                var articles = await _articleService.GetAllArticlesAsync();
                
                // Áp dụng bộ lọc
                if (!string.IsNullOrEmpty(searchString))
                {
                    articles = articles.Where(a => 
                        a.Title.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        a.Content.Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        (a.Author ?? "").Contains(searchString, StringComparison.OrdinalIgnoreCase) ||
                        (a.Tags ?? "").Contains(searchString, StringComparison.OrdinalIgnoreCase));
                }

                if (type.HasValue)
                {
                    articles = articles.Where(a => a.Type == type.Value);
                }

                if (category.HasValue)
                {
                    articles = articles.Where(a => a.Category == category.Value);
                }

                if (isPublished.HasValue)
                {
                    articles = articles.Where(a => a.IsPublished == isPublished.Value);
                }

                var orderedArticles = articles.OrderByDescending(a => a.CreatedAt);

                // Phân trang
                var totalCount = orderedArticles.Count();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
                var pagedArticles = orderedArticles.Skip((page - 1) * pageSize).Take(pageSize);

                ViewBag.SearchString = searchString;
                ViewBag.Type = type;
                ViewBag.Category = category;
                ViewBag.IsPublished = isPublished;
                ViewBag.CurrentPage = page;
                ViewBag.TotalPages = totalPages;
                ViewBag.PageSize = pageSize;
                ViewBag.TotalCount = totalCount;

                return View(pagedArticles);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Lỗi khi tải danh sách bài viết: " + ex.Message;
                return View(new List<Article>());
            }
        }

        // GET: Admin/ArticlesAdmin/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var article = await _articleService.GetArticleByIdAsync(id.Value);
                if (article == null)
                {
                    return NotFound();
                }

                return View(article);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Lỗi khi tải chi tiết bài viết: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/ArticlesAdmin/Create
        public IActionResult Create()
        {
            var article = new CreateArticleDto
            {
                Type = ArticleType.Blog,
                Category = ArticleCategory.News,
                DisplayOrder = 0,
                IsPublished = false,
                IsFeatured = false
            };
            return View(article);
        }

        // POST: Admin/ArticlesAdmin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromForm] CreateArticleDto articleDto, IFormFile? imageFile)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Xử lý upload hình ảnh
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        try
                        {
                            var uploadedFilePath = await _fileUploadService.UploadFileAsync(imageFile, "articles");
                            if (!string.IsNullOrEmpty(uploadedFilePath))
                            {
                                articleDto.ImageUrl = uploadedFilePath;
                            }
                            else
                            {
                                ModelState.AddModelError("ImageFile", "Không thể upload hình ảnh");
                                return View(articleDto);
                            }
                        }
                        catch (Exception ex)
                        {
                            ModelState.AddModelError("ImageFile", "Lỗi upload hình ảnh: " + ex.Message);
                            return View(articleDto);
                        }
                    }

                    var article = MapFromCreateDto(articleDto);
                    var createdArticle = await _articleService.CreateArticleAsync(article);
                    
                    TempData["Success"] = "Tạo bài viết thành công!";
                    return RedirectToAction(nameof(Details), new { id = createdArticle.Id });
                }

                return View(articleDto);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi khi tạo bài viết: " + ex.Message);
                return View(articleDto);
            }
        }

        // GET: Admin/ArticlesAdmin/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var article = await _articleService.GetArticleByIdAsync(id.Value);
                if (article == null)
                {
                    return NotFound();
                }

                var dto = MapToUpdateDto(article);
                return View(dto);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Lỗi khi tải bài viết để chỉnh sửa: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ArticlesAdmin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [FromForm] UpdateArticleDto articleDto, IFormFile? imageFile)
        {
            if (id != articleDto.Id)
            {
                return NotFound();
            }

            try
            {
                if (ModelState.IsValid)
                {
                    var existingArticle = await _articleService.GetArticleByIdAsync(id);
                    if (existingArticle == null)
                    {
                        return NotFound();
                    }

                    // Xử lý upload hình ảnh
                    if (imageFile != null && imageFile.Length > 0)
                    {
                        try
                        {
                            var uploadedFilePath = await _fileUploadService.UploadFileAsync(imageFile, "articles");
                            if (!string.IsNullOrEmpty(uploadedFilePath))
                            {
                                articleDto.ImageUrl = uploadedFilePath;
                            }
                            else
                            {
                                ModelState.AddModelError("ImageFile", "Không thể upload hình ảnh");
                                return View(articleDto);
                            }
                        }
                        catch (Exception ex)
                        {
                            ModelState.AddModelError("ImageFile", "Lỗi upload hình ảnh: " + ex.Message);
                            return View(articleDto);
                        }
                    }

                    var article = MapFromUpdateDto(articleDto, existingArticle);
                    await _articleService.UpdateArticleAsync(article);
                    
                    TempData["Success"] = "Cập nhật bài viết thành công!";
                    return RedirectToAction(nameof(Details), new { id = article.Id });
                }

                return View(articleDto);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Lỗi khi cập nhật bài viết: " + ex.Message);
                return View(articleDto);
            }
        }

        // GET: Admin/ArticlesAdmin/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                var article = await _articleService.GetArticleByIdAsync(id.Value);
                if (article == null)
                {
                    return NotFound();
                }

                return View(article);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Lỗi khi tải bài viết để xóa: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ArticlesAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var article = await _articleService.GetArticleByIdAsync(id);
                if (article == null)
                {
                    return NotFound();
                }

                await _articleService.DeleteArticleAsync(id);
                TempData["Success"] = "Xóa bài viết thành công!";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Lỗi khi xóa bài viết: " + ex.Message;
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/ArticlesAdmin/Publish/5
        [HttpPost]
        public async Task<IActionResult> Publish(int id)
        {
            try
            {
                var article = await _articleService.PublishArticleAsync(id);
                if (article == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy bài viết" });
                }

                return Json(new { success = true, message = "Xuất bản bài viết thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi khi xuất bản bài viết: " + ex.Message });
            }
        }

        // POST: Admin/ArticlesAdmin/Unpublish/5
        [HttpPost]
        public async Task<IActionResult> Unpublish(int id)
        {
            try
            {
                var article = await _articleService.GetArticleByIdAsync(id);
                if (article == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy bài viết" });
                }

                article.IsPublished = false;
                article.PublishedAt = null;
                article.UpdatedAt = DateTime.UtcNow;

                await _articleService.UpdateArticleAsync(article);
                return Json(new { success = true, message = "Hủy xuất bản bài viết thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi khi hủy xuất bản bài viết: " + ex.Message });
            }
        }

        // POST: Admin/ArticlesAdmin/ToggleFeatured/5
        [HttpPost]
        public async Task<IActionResult> ToggleFeatured(int id)
        {
            try
            {
                var article = await _articleService.GetArticleByIdAsync(id);
                if (article == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy bài viết" });
                }

                article.IsFeatured = !article.IsFeatured;
                article.UpdatedAt = DateTime.UtcNow;

                await _articleService.UpdateArticleAsync(article);
                
                var message = article.IsFeatured ? "Đã đánh dấu bài viết nổi bật!" : "Đã bỏ đánh dấu bài viết nổi bật!";
                return Json(new { success = true, message = message, isFeatured = article.IsFeatured });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi khi thay đổi trạng thái nổi bật: " + ex.Message });
            }
        }

        // Các phương thức helper để chuyển đổi giữa entity và DTO
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

        private UpdateArticleDto MapToUpdateDto(Article article)
        {
            return new UpdateArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Content = article.Content,
                Summary = article.Summary,
                ImageUrl = article.ImageUrl,
                Type = article.Type,
                Category = article.Category,
                Tags = article.Tags,
                Author = article.Author,
                IsPublished = article.IsPublished,
                IsFeatured = article.IsFeatured,
                DisplayOrder = article.DisplayOrder,
                MetaTitle = article.MetaTitle,
                MetaDescription = article.MetaDescription,
                MetaKeywords = article.MetaKeywords
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
