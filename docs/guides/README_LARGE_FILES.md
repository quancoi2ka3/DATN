# Xử lý File Lớn trong Git Repository

Repository này chứa các file lớn (đặc biệt là thư mục môi trường ảo Python cho Rasa) mà có thể vượt quá giới hạn kích thước file của GitHub (100MB). Dưới đây là các phương pháp để xử lý vấn đề này.

## Phương án 1: Sử dụng BFG Repo-Cleaner

BFG là một công cụ hiệu quả để xóa các file lớn khỏi lịch sử Git.

### Cách sử dụng:
1. Đảm bảo Java đã được cài đặt
2. Chạy script `remove-large-files-bfg.bat`
3. Thực hiện force push sau khi hoàn tất: `git push -f origin master`

## Phương án 2: Sử dụng git-filter-repo

git-filter-repo là một công cụ mạnh mẽ hơn cả BFG và git filter-branch.

### Cách sử dụng:
1. Cài đặt git-filter-repo: `pip install git-filter-repo`
2. Chạy script `remove-large-files-filter-repo.bat`
3. Force push sau khi hoàn tất: `git push -f origin master`

## Phương án 3: Tạo repository mới

Nếu các phương pháp trên không hiệu quả, bạn có thể tạo một repository mới và chỉ commit các file cần thiết.

### Cách sử dụng:
1. Chạy script `create-clean-repo.bat` với tên người dùng GitHub của bạn:
   ```
   create-clean-repo.bat your-github-username
   ```
2. Làm theo hướng dẫn trên màn hình

## Phương án 4: Sử dụng Git LFS

Nếu bạn cần làm việc với file lớn, Git LFS (Large File Storage) là giải pháp tốt nhất.

### Cách thiết lập Git LFS:
1. Cài đặt Git LFS từ https://git-lfs.github.com/
2. Thiết lập LFS cho repository: `git lfs install`
3. Tham khảo hướng dẫn đầy đủ tại: `docs/guides/GIT_LFS_GUIDE.md`

## Lưu ý quan trọng

- **KHÔNG** commit các thư mục môi trường ảo (rasa_env_310, venv, node_modules)
- Luôn cập nhật file `.gitignore` khi thêm các file/thư mục cần bỏ qua
- Sử dụng `requirements.txt` hoặc `package.json` để quản lý phụ thuộc thay vì commit toàn bộ thư mục môi trường
- Tham khảo `ENVIRONMENT_SETUP_GUIDE.md` để biết cách thiết lập môi trường phát triển
