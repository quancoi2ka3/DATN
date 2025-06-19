using Microsoft.EntityFrameworkCore;
using SunMovement.Core.Models;
using SunMovement.Infrastructure.Data;

namespace SunMovement.Web.Data
{
    public static class ArticleSeeder
    {
        public static async Task SeedArticlesAsync(ApplicationDbContext context)
        {
            // Kiểm tra nếu đã có dữ liệu
            if (await context.Articles.AnyAsync())
            {
                return; // Đã có dữ liệu rồi
            }

            var articles = new List<Article>
            {
                new Article
                {
                    Title = "Hướng dẫn Calisthenics cho người mới bắt đầu",
                    Content = "<h2>Giới thiệu về Calisthenics</h2><p>Calisthenics là một hình thức tập luyện sử dụng trọng lượng cơ thể để phát triển sức mạnh, sự linh hoạt và thể lực tổng thể. Đây là phương pháp tập luyện lý tưởng cho những người mới bắt đầu.</p><h3>Lợi ích của Calisthenics</h3><ul><li>Không cần thiết bị phức tạp</li><li>Có thể tập luyện mọi lúc, mọi nơi</li><li>Phát triển sức mạnh chức năng</li><li>Cải thiện sự linh hoạt và thăng bằng</li></ul><h3>Các bài tập cơ bản</h3><p>1. <strong>Push-ups (Hít đất)</strong> - Phát triển cơ ngực, vai và tay</p><p>2. <strong>Pull-ups (Kéo xà)</strong> - Tăng cường cơ lưng và tay</p><p>3. <strong>Squats (Gánh tạ)</strong> - Rèn luyện cơ chân và mông</p><p>4. <strong>Planks</strong> - Tăng cường cơ core</p>",
                    Summary = "Hướng dẫn chi tiết về Calisthenics dành cho người mới bắt đầu, bao gồm các bài tập cơ bản và lợi ích.",
                    Type = ArticleType.Guide,
                    Category = ArticleCategory.Calisthenics,
                    Tags = "calisthenics, người mới bắt đầu, hướng dẫn, tập luyện",
                    Author = "Sun Movement Team",
                    IsPublished = true,
                    IsFeatured = true,
                    DisplayOrder = 1,
                    MetaTitle = "Hướng dẫn Calisthenics cho người mới bắt đầu - Sun Movement",
                    MetaDescription = "Học cách tập Calisthenics từ cơ bản đến nâng cao. Hướng dẫn chi tiết các bài tập và kỹ thuật cho người mới bắt đầu.",
                    MetaKeywords = "calisthenics, hướng dẫn, người mới bắt đầu, tập luyện",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    PublishedAt = DateTime.UtcNow.AddDays(-10),
                    ViewCount = 125
                },

                new Article
                {
                    Title = "10 Lợi ích tuyệt vời của việc tập Yoga",
                    Content = "<h2>Yoga - Nghệ thuật sống khỏe mạnh</h2><p>Yoga không chỉ là một bài tập thể dục mà còn là một lối sống giúp cân bằng giữa cơ thể, tâm trí và tinh thần.</p><h3>10 Lợi ích chính của Yoga:</h3><ol><li><strong>Tăng cường sự linh hoạt</strong> - Các tư thế yoga giúp kéo giãn và tăng độ linh hoạt cho cơ thể</li><li><strong>Cải thiện sức mạnh cơ bắp</strong> - Nhiều tư thế yoga đòi hỏi sức mạnh để duy trì</li><li><strong>Giảm căng thẳng</strong> - Yoga giúp thư giãn và giảm stress hiệu quả</li><li><strong>Cải thiện giấc ngủ</strong> - Thực hành yoga đều đặn giúp ngủ ngon hơn</li><li><strong>Tăng cường thăng bằng</strong> - Các tư thế cân bằng giúp cải thiện khả năng điều phối</li></ol>",
                    Summary = "Khám phá 10 lợi ích tuyệt vời mà Yoga mang lại cho sức khỏe thể chất và tinh thần của bạn.",
                    Type = ArticleType.Blog,
                    Category = ArticleCategory.Yoga,
                    Tags = "yoga, sức khỏe, thể dục, tinh thần",
                    Author = "Yoga Master",
                    IsPublished = true,
                    IsFeatured = false,
                    DisplayOrder = 2,
                    MetaTitle = "10 Lợi ích tuyệt vời của Yoga - Sun Movement",
                    MetaDescription = "Tìm hiểu về những lợi ích tuyệt vời mà Yoga mang lại cho sức khỏe và tinh thần của bạn.",
                    MetaKeywords = "yoga, lợi ích, sức khỏe, thể dục",
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    PublishedAt = DateTime.UtcNow.AddDays(-7),
                    ViewCount = 89
                },

                new Article
                {
                    Title = "Chào mừng đến với Sun Movement - Nơi bắt đầu hành trình khỏe mạnh",
                    Content = "<h1>Sun Movement - Nơi khởi đầu cho sự thay đổi</h1><p>Chào mừng bạn đến với Sun Movement - trung tâm thể dục thể thao hàng đầu, nơi chúng tôi cam kết mang đến cho bạn trải nghiệm tập luyện tuyệt vời nhất.</p><h2>Tại sao chọn Sun Movement?</h2><ul><li>Đội ngũ huấn luyện viên chuyên nghiệp với kinh nghiệm quốc tế</li><li>Cơ sở vật chất hiện đại, trang thiết bị tiên tiến</li><li>Chương trình tập luyện đa dạng phù hợp mọi độ tuổi</li><li>Môi trường tập luyện thân thiện và tích cực</li></ul>",
                    Summary = "Sun Movement là điểm đến lý tưởng cho những ai muốn bắt đầu hành trình rèn luyện sức khỏe và thể hình.",
                    Type = ArticleType.HeroBanner,
                    Category = ArticleCategory.Homepage,
                    Tags = "sun movement, giới thiệu, fitness, gym",
                    Author = "Admin",
                    IsPublished = true,
                    IsFeatured = true,
                    DisplayOrder = 0,
                    MetaTitle = "Sun Movement - Trung tâm thể dục thể thao hàng đầu",
                    MetaDescription = "Sun Movement - Trung tâm thể dục thể thao chuyên nghiệp với đội ngũ huấn luyện viên giàu kinh nghiệm và trang thiết bị hiện đại.",
                    MetaKeywords = "sun movement, gym, fitness, thể dục",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    PublishedAt = DateTime.UtcNow.AddDays(-15),
                    ViewCount = 256
                },

                new Article
                {
                    Title = "Dinh dưỡng thể thao: Ăn gì để tối ưu hiệu quả tập luyện?",
                    Content = "<h2>Dinh dưỡng - Yếu tố quan trọng trong tập luyện</h2><p>Dinh dưỡng đóng vai trò then chốt trong việc đạt được mục tiêu thể dục thể thao. Ăn đúng cách không chỉ cung cấp năng lượng mà còn giúp phục hồi cơ bắp hiệu quả.</p><h3>Nguyên tắc dinh dưỡng thể thao:</h3><h4>1. Protein - Xây dựng cơ bắp</h4><p>Protein là vật liệu xây dựng cơ bắp. Nên tiêu thụ 1.6-2.2g protein/kg thể trọng mỗi ngày.</p><h4>2. Carbohydrate - Nguồn năng lượng</h4><p>Carbs cung cấp năng lượng cho quá trình tập luyện. Nên ăn carbs phức hợp như yến mạch, gạo lứt.</p><h4>3. Chất béo lành mạnh</h4><p>Omega-3, omega-6 từ cá, hạt, dầu oliu giúp chống viêm và phục hồi.</p>",
                    Summary = "Hướng dẫn chi tiết về dinh dưỡng thể thao, giúp bạn ăn đúng cách để tối ưu hóa hiệu quả tập luyện.",
                    Type = ArticleType.Guide,
                    Category = ArticleCategory.Nutrition,
                    Tags = "dinh dưỡng, thể thao, protein, carbohydrate",
                    Author = "Nutritionist Expert",
                    IsPublished = true,
                    IsFeatured = false,
                    DisplayOrder = 3,
                    MetaTitle = "Dinh dưỡng thể thao: Ăn đúng cách để tối ưu tập luyện",
                    MetaDescription = "Hướng dẫn dinh dưỡng thể thao từ chuyên gia. Cách ăn uống đúng để tăng hiệu quả tập luyện và phục hồi cơ bắp.",
                    MetaKeywords = "dinh dưỡng thể thao, protein, carbohydrate, ăn uống",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    ViewCount = 73
                },

                new Article
                {
                    Title = "Câu chuyện thành công của anh Minh - Từ 85kg xuống 70kg",
                    Content = "<blockquote>Sun Movement đã thay đổi hoàn toàn cuộc sống của tôi. Từ một người béo phì 85kg, giờ tôi đã có thể duy trì cân nặng 70kg một cách khỏe mạnh.</blockquote><p><strong>Anh Nguyễn Văn Minh, 32 tuổi, Kế toán</strong></p><p>Trước khi đến Sun Movement, tôi đã thử rất nhiều phương pháp giảm cân nhưng đều thất bại. Công việc văn phòng khiến tôi ít vận động, ăn uống không điều độ.</p><h3>Hành trình 6 tháng tại Sun Movement:</h3><ul><li><strong>Tháng 1-2:</strong> Làm quen với môi trường, học các động tác cơ bản</li><li><strong>Tháng 3-4:</strong> Tăng cường độ tập luyện, điều chỉnh chế độ ăn</li><li><strong>Tháng 5-6:</strong> Duy trì và hoàn thiện kết quả</li></ul><p>Cảm ơn đội ngũ PT tận tâm của Sun Movement đã giúp tôi có được thân hình như hôm nay!</p>",
                    Summary = "Câu chuyện thành công của anh Minh - Từ 85kg xuống 70kg trong 6 tháng tập luyện tại Sun Movement.",
                    Type = ArticleType.Testimonial,
                    Category = ArticleCategory.CustomerReviews,
                    Tags = "thành công, giảm cân, testimonial, khách hàng",
                    Author = "Customer Story",
                    IsPublished = true,
                    IsFeatured = true,
                    DisplayOrder = 4,
                    MetaTitle = "Câu chuyện thành công giảm 15kg tại Sun Movement",
                    MetaDescription = "Đọc câu chuyện thành công của anh Minh - giảm từ 85kg xuống 70kg trong 6 tháng tại Sun Movement.",
                    MetaKeywords = "giảm cân thành công, testimonial, khách hàng, sun movement",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    PublishedAt = DateTime.UtcNow.AddDays(-3),
                    ViewCount = 45
                }
            };

            await context.Articles.AddRangeAsync(articles);
            await context.SaveChangesAsync();
        }
    }
}
