using System;
using System.ComponentModel.DataAnnotations;

namespace SunMovement.Core.Models
{
    public class Article
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

        public string? Tags { get; set; } // JSON array of tags

        [StringLength(250, ErrorMessage = "Tác giả không được vượt quá 250 ký tự")]
        public string? Author { get; set; }

        public bool IsPublished { get; set; } = false;

        public bool IsFeatured { get; set; } = false;

        public int ViewCount { get; set; } = 0;

        public DateTime? PublishedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }        // SEO Properties
        [StringLength(60, ErrorMessage = "Meta title không được vượt quá 60 ký tự")]
        public string? MetaTitle { get; set; }

        [StringLength(160, ErrorMessage = "Meta description không được vượt quá 160 ký tự")]
        public string? MetaDescription { get; set; }

        [StringLength(100, ErrorMessage = "Meta keywords không được vượt quá 100 ký tự")]
        public string? MetaKeywords { get; set; }

        // Display order for featured content
        public int DisplayOrder { get; set; } = 0;
    }

    public enum ArticleType
    {
        [Display(Name = "Tin tức")]
        News = 1,

        [Display(Name = "Blog")]
        Blog = 2,

        [Display(Name = "Hướng dẫn")]
        Guide = 3,

        [Display(Name = "Hero Banner")]
        HeroBanner = 4,

        [Display(Name = "Testimonial")]
        Testimonial = 5,

        [Display(Name = "About Content")]
        AboutContent = 6,

        [Display(Name = "Footer Content")]
        FooterContent = 7,

        [Display(Name = "Page Content")]
        PageContent = 8
    }

    public enum ArticleCategory
    {
        [Display(Name = "Trang chủ")]
        Homepage = 1,

        [Display(Name = "Về chúng tôi")]
        About = 2,

        [Display(Name = "Dịch vụ")]
        Services = 3,

        [Display(Name = "Sản phẩm")]
        Products = 4,

        [Display(Name = "Sự kiện")]
        Events = 5,

        [Display(Name = "Tin tức")]
        News = 6,

        [Display(Name = "Hướng dẫn tập luyện")]
        WorkoutGuides = 7,

        [Display(Name = "Dinh dưỡng")]
        Nutrition = 8,

        [Display(Name = "Calisthenics")]
        Calisthenics = 9,

        [Display(Name = "Yoga")]
        Yoga = 10,

        [Display(Name = "Strength Training")]
        StrengthTraining = 11,

        [Display(Name = "Đánh giá khách hàng")]
        CustomerReviews = 12,

        [Display(Name = "Khuyến mãi")]
        Promotions = 13
    }
}
