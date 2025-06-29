# Hướng dẫn cài đặt và sử dụng Git LFS

Git LFS (Large File Storage) là một extension của Git giúp quản lý các file lớn một cách hiệu quả. Thay vì lưu trữ toàn bộ nội dung của file lớn trong repository Git, Git LFS lưu trữ một file pointer và lưu trữ nội dung thực trên GitHub LFS server.

## 1. Cài đặt Git LFS

### Windows
1. Tải Git LFS từ trang web chính thức: https://git-lfs.github.com/
2. Chạy file cài đặt và làm theo hướng dẫn
3. Hoặc sử dụng Chocolatey:
   ```
   choco install git-lfs
   ```

### macOS
```
brew install git-lfs
```

### Linux (Ubuntu/Debian)
```
sudo apt-get install git-lfs
```

## 2. Thiết lập Git LFS

Sau khi cài đặt, bạn cần cấu hình Git LFS cho repository của mình:

```bash
git lfs install
```

## 3. Sử dụng Git LFS trong dự án này

Repository này đã được cấu hình để sử dụng Git LFS cho các loại file lớn thông qua file `.gitattributes`. Các loại file này bao gồm:

- Model files (.pb, .h5, .model, etc.)
- Binary files (.dll, .pyd, .so)
- Archives (.zip, .tar.gz)
- Và nhiều định dạng lớn khác

## 4. Thêm các loại file mới vào Git LFS

Nếu bạn cần thêm một loại file mới để theo dõi bằng Git LFS:

```bash
git lfs track "*.extension"
```

Điều này sẽ cập nhật file `.gitattributes` của bạn. Đảm bảo commit file `.gitattributes` sau khi thực hiện thay đổi:

```bash
git add .gitattributes
git commit -m "Add new file type to Git LFS tracking"
```

## 5. Kiểm tra trạng thái Git LFS

Để xem những file nào đang được theo dõi bởi Git LFS:

```bash
git lfs ls-files
```

## 6. Lưu ý quan trọng

- Sau khi thiết lập Git LFS, bạn vẫn commit và push bình thường như với Git
- Git LFS sẽ tự động xử lý các file lớn theo cấu hình trong `.gitattributes`
- Đảm bảo người dùng khác trong nhóm cũng cài đặt Git LFS

## 7. Khắc phục sự cố

- Nếu gặp lỗi khi push các file lớn, hãy chắc chắn rằng Git LFS đã được cài đặt và cấu hình đúng
- Nếu file lớn đã được commit trước khi cấu hình Git LFS, bạn cần phải loại bỏ chúng khỏi lịch sử Git và commit lại

## Tài liệu tham khảo

- [Trang chủ Git LFS](https://git-lfs.github.com/)
- [Tài liệu Git LFS](https://github.com/git-lfs/git-lfs/tree/main/docs)
- [Hướng dẫn Git LFS của GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)
