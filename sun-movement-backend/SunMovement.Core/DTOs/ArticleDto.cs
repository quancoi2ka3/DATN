using SunMovement.Core.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.DTOs
{
    public class ArticleDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề bài viết là bắt buộc")]
        [StringLength(250, ErrorMessage = "Tiêu đề không được vượt quá 250 ký tự")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nội dung bài viết là bắt buộc")]
        public string Content { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Mô tả ngắn không được vượt quá 500 ký tự")]
        public string? Summary { get; set; }

        [StringLength(250, ErrorMessage = "Slug không được vượt quá 250 ký tự")]
        public string? Slug { get; set; }

        public string? ImageUrl { get; set; }

        [Required(ErrorMessage = "Loại bài viết là bắt buộc")]
        public ArticleType Type { get; set; }

        [Required(ErrorMessage = "Danh mục bài viết là bắt buộc")]
        public ArticleCategory Category { get; set; }

        public string? Tags { get; set; }

        [StringLength(250, ErrorMessage = "Tác giả không được vượt quá 250 ký tự")]
        public string? Author { get; set; }

        public bool IsPublished { get; set; } = false;

        public bool IsFeatured { get; set; } = false;

        public int ViewCount { get; set; } = 0;

        public DateTime? PublishedAt { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [StringLength(60, ErrorMessage = "Meta title không được vượt quá 60 ký tự")]
        public string? MetaTitle { get; set; }

        [StringLength(160, ErrorMessage = "Meta description không được vượt quá 160 ký tự")]
        public string? MetaDescription { get; set; }

        [StringLength(100, ErrorMessage = "Meta keywords không được vượt quá 100 ký tự")]
        public string? MetaKeywords { get; set; }

        public int DisplayOrder { get; set; } = 0;
    }

    public class CreateArticleDto
    {
        [Required(ErrorMessage = "Tiêu đề bài viết là bắt buộc")]
        [StringLength(250, ErrorMessage = "Tiêu đề không được vượt quá 250 ký tự")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nội dung bài viết là bắt buộc")]
        public string Content { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Mô tả ngắn không được vượt quá 500 ký tự")]
        public string? Summary { get; set; }

        public string? ImageUrl { get; set; }

        [Required(ErrorMessage = "Loại bài viết là bắt buộc")]
        public ArticleType Type { get; set; }

        [Required(ErrorMessage = "Danh mục bài viết là bắt buộc")]
        public ArticleCategory Category { get; set; }

        public string? Tags { get; set; }

        [StringLength(250, ErrorMessage = "Tác giả không được vượt quá 250 ký tự")]
        public string? Author { get; set; }

        public bool IsPublished { get; set; } = false;

        public bool IsFeatured { get; set; } = false;

        [StringLength(60, ErrorMessage = "Meta title không được vượt quá 60 ký tự")]
        public string? MetaTitle { get; set; }

        [StringLength(160, ErrorMessage = "Meta description không được vượt quá 160 ký tự")]
        public string? MetaDescription { get; set; }

        [StringLength(100, ErrorMessage = "Meta keywords không được vượt quá 100 ký tự")]
        public string? MetaKeywords { get; set; }

        public int DisplayOrder { get; set; } = 0;
    }

    public class UpdateArticleDto : CreateArticleDto
    {
        public int Id { get; set; }
    }
}
