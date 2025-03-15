-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th3 14, 2025 lúc 05:02 PM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `travel`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `likes`
--

CREATE TABLE `likes` (
  `id` int NOT NULL,
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `image_url` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `test_table`
--

CREATE TABLE `test_table` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `trip`
--

CREATE TABLE `trip` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` text NOT NULL,
  `description` text NOT NULL,
  `rating` float NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `category` enum('vietnam','global','beach','moutain','island') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `trip`
--

INSERT INTO `trip` (`id`, `name`, `image`, `description`, `rating`, `price`, `duration`, `location`, `category`) VALUES
(1, 'Ha Long Bay Tour', 'https://bcp.cdnchinhphu.vn/zoom/670_420/344443456812359680/2023/9/18/hl-4938-1695021625841340768767-40-0-665-1000-crop-16950216593851114825614.jpg', 'Explore the stunning Ha Long Bay.', 4.8, 120.00, '3 Days', 'Quang Ninh, Vietnam', 'vietnam'),
(2, 'Eiffel Tower Trip', 'https://t4.ftcdn.net/jpg/04/06/66/89/360_F_406668973_3X2cGom7KOgKaLfH7Fyjw7nnUegRlunf.jpg', 'Visit the famous Eiffel Tower in Paris.', 4.7, 200.00, '5 Days', 'Paris, France', 'global'),
(3, 'Phu Quoc Island', 'https://media.hanoitimes.vn/2023/3/22/phuquoc2.jpg', 'Enjoy the beautiful beaches of Phu Quoc.', 4.5, 150.00, '4 Days', 'Kien Giang, Vietnam', 'island'),
(4, 'Sapa Mountain Adventure', 'https://statics.vinpearl.com/Sapa-mountain-thumb_1692863267.jpg', 'Trek through the mountains of Sapa.', 4.6, 180.00, '5 Days', 'Lao Cai, Vietnam', 'moutain'),
(5, 'Bali Beach Escape', 'https://www.shutterstock.com/image-photo/tropical-sunset-beach-background-summer-600nw-2140097083.jpg', 'Relax on the beaches of Bali.', 4.9, 220.00, '7 Days', 'Bali, Indonesia', 'beach'),
(6, 'Hội An', 'https://hoiana.com/wp-content/uploads/2025/01/ve-tham-quan-hoi-an-9.webp', 'Phố cổ Hội An, di sản văn hóa thế giới', 4.8, 140.00, '3 days', 'Quảng Nam', 'vietnam'),
(7, 'Nha Trang', 'https://letsflytravel.vn/wp-content/uploads/2024/08/nha-trang-2.webp', 'Thành phố biển đẹp nhất Việt Nam', 4.7, 200.00, '4 days', 'Khánh Hòa', 'vietnam'),
(8, 'Hà Nội', 'https://vcdn1-dulich.vnecdn.net/2022/05/12/Hanoi2-1652338755-3632-1652338809.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=NxMN93PTvOTnHNryMx3xJw', 'Thủ đô ngàn năm văn hiến', 4.9, 180.00, '3 days', 'Hà Nội', 'vietnam'),
(9, 'Sài Gòn', 'https://www.kkday.com/vi/blog/wp-content/uploads/sa%CC%80i-go%CC%80n.jpeg', 'Thành phố không ngủ', 4.6, 170.00, '2 days', 'TP. Hồ Chí Minh', 'vietnam'),
(10, 'Quảng Bình', 'https://admin.datxanhmientrung.com/wp-content/uploads/2023/12/du-lich-quang-binh.jpg', 'Vùng đất của những kỳ quan thiên nhiên', 4.7, 200.00, '2 days', 'Quảng Bình', 'vietnam'),
(11, 'Sa Pa', 'https://mtcs.1cdn.vn/2023/06/07/spcv.jpg', 'Thị trấn sương mù giữa núi rừng Tây Bắc', 4.8, 250.00, '3 days', 'Lào Cai', 'vietnam'),
(12, 'Đà Lạt', 'https://cdn3.ivivu.com/2023/10/du-lich-Da-Lat-ivivu1.jpg', 'Thành phố ngàn hoa', 4.9, 190.00, '3 days', 'Lâm Đồng', 'vietnam'),
(13, 'Đà Nẵng', 'https://phuquocxanh.com/vi/wp-content/uploads/2023/05/da-nang-3.jpg', 'Thành phố biển năng động', 4.8, 210.00, '3 days', 'Đà Nẵng', 'vietnam'),
(14, 'Huế', 'https://www.bambooairways.com/documents/20122/1165110/dia-diem-du-lich-hue-4.jpg/358a6a0a-9492-e630-9fda-5fd2222d34f1?t=1694774986511', 'Kinh đô cổ của Việt Nam', 4.7, 160.00, '3 days', 'Thừa Thiên Huế', 'vietnam'),
(15, 'Nghệ An', 'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/30/du-lich-nghe-an-3-1507.jpg', 'Vùng đất địa linh nhân kiệt', 4.6, 150.00, '2 days', 'Nghệ An', 'vietnam'),
(16, 'New York', 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/2/11/1146750/Fun-Things-To-Do-In--01.jpg', 'Thành phố không bao giờ ngủ', 4.9, 500.00, '5 days', 'Mỹ', 'global'),
(17, 'Thailand', 'https://cdn.saigontimestravel.com/storage/images/retail/wp-content/uploads/2024/09/Du-lich-Thai-Lan-thang-1-2.jpg', 'Đất nước chùa Vàng', 4.7, 300.00, '4 days', 'Thái Lan', 'global'),
(18, 'Tokyo', 'https://toquoc.mediacdn.vn/2019/6/26/photo-1-1561514553684677883269.jpg', 'Thủ đô hiện đại bậc nhất Nhật Bản', 4.8, 600.00, '5 days', 'Nhật Bản', 'global'),
(19, 'Shanghai', 'https://dulichphuonghoang.vn/upload/images/thanh-pho-thuong-hai-noi-sam-uat-bac-nhat-the-gioi.jpg', 'Thành phố sầm uất nhất Trung Quốc', 4.7, 550.00, '5 days', 'Trung Quốc', 'global'),
(20, 'Seoul', 'https://duhocgreen.edu.vn/wp-content/uploads/2022/09/Thanh-pho-lon-tai-Han-Quoc.jpg', 'Thủ đô văn hóa và công nghệ Hàn Quốc', 4.8, 500.00, '5 days', 'Hàn Quốc', 'global'),
(21, 'France', 'https://datviettour.com.vn/uploads/images/tin-tuc-SEO-chau-au/phap/danh-thang/du-lich-phap-vao-thang-may-1.jpg', 'Kinh đô ánh sáng Paris', 4.9, 700.00, '6 days', 'Pháp', 'global'),
(22, 'Italy', 'https://duhocvic.com/wp-content/uploads/2021/04/dat-nuoc-y-xinh-dep-720x450.jpg', 'Đất nước của nghệ thuật và lịch sử', 4.8, 750.00, '6 days', 'Ý', 'global'),
(23, 'Phu Quoc', 'https://nld.mediacdn.vn/291774122806476800/2024/2/29/5-chot-thumbnailmot-goc-tp-phu-quoc-1709217336947996291976.jpg', 'Hòn đảo ngọc của Việt Nam', 4.8, 500.00, '3 days', 'Việt Nam', 'island'),
(24, 'Hawaii', 'https://pantravel.vn/wp-content/uploads/2024/11/220.jpg', 'Thiên đường du lịch biển nước Mỹ', 4.9, 900.00, '6 days', 'Mỹ', 'island'),
(25, 'Bali', 'https://nhatrangtourist.com/image/catalog/TOUR%20N%C6%AF%E1%BB%9AC%20NGO%C3%80I/BALI/BALI%209.jpg', 'Hòn đảo thiên đường của Indonesia', 4.7, 700.00, '5 days', 'Indonesia', 'island'),
(26, 'Palawan', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/e7/b0/ea/photo0jpg.jpg?w=1400&h=1400&s=1', 'Viên ngọc quý của Philippines', 4.8, 600.00, '4 days', 'Philippines', 'island'),
(27, 'Bora Bora', 'https://images.baodantoc.vn/uploads/2022/Th%C3%A1ng%206/Ng%C3%A0y%201/Anh/13.jpg', 'Thiên đường nghỉ dưỡng ở Thái Bình Dương', 4.9, 1000.00, '6 days', 'Pháp', 'island'),
(28, 'Mallorca', 'https://cdn.vntrip.vn/cam-nang/wpcontent/uploads/2022/07/best_mallorca_marinas.jpg', 'Hòn đảo đẹp nhất Tây Ban Nha', 4.7, 850.00, '5 days', 'Tây Ban Nha', 'island'),
(29, 'Jamaica', 'https://danviet.mediacdn.vn/296231569849192448/2021/11/30/photo-1638259228044-16382592312641911068973.jpg', 'Hòn đảo sôi động của Caribbean', 4.6, 400.00, '2 days', 'Jamaica', 'island'),
(30, 'Grand Teton', 'https://img1.advisor.travel/1314x680px-Grand_Teton_National_Park_27.jpg', 'Công viên quốc gia Grand Teton với cảnh đẹp hùng vĩ', 4.8, 700.00, '5 days', 'Mỹ', 'moutain'),
(31, 'Matterhorn', 'https://dulichviet.com.vn/images/bandidau/chinh-phuc-dinh-nui-Matterhorn-nguy-nga-bac-nhat-khi-du-lich-thuy-si.jpg', 'Đỉnh núi nổi tiếng của Thụy Sĩ với hình dáng đặc biệt', 4.9, 1000.00, '6 days', 'Thụy Sĩ', 'moutain'),
(32, 'Aoraki', 'https://res.klook.com/image/upload/c_fill,w_420,h_260/q_65/activities/wwrqdg5tuf1pccdqccjq.jpg', 'Ngọn núi cao nhất New Zealand với khung cảnh tuyệt đẹp', 4.7, 600.00, '4 days', 'New Zealand', 'moutain'),
(33, 'Kirkjufell', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/af/0c/8f/aurora-borealis-at-mount.jpg?w=1200&h=1200&s=1', 'Ngọn núi đẹp nhất Iceland với cực quang huyền ảo', 4.8, 500.00, '3 days', 'Iceland', 'moutain'),
(34, 'Vinicunca', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/0a/a8/57/photo4jpg.jpg?w=900&h=500&s=1', 'Núi cầu vồng nổi tiếng của Peru với màu sắc độc đáo', 4.6, 400.00, '2 days', 'Peru', 'moutain');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `image`, `name`) VALUES
(1, 'mai@gmail.com', '$2b$10$1bRZIBppVPXFEccJd0CvMOHLxyHwLLLfT9T4QNhODH1yAvxyqELhW', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0CdGx3yK04X8RfIF69Ajz4XN_slXpbDpS9w&s', 'mai');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users_trip`
--

CREATE TABLE `users_trip` (
  `user_trip_id` int NOT NULL,
  `user_id` int NOT NULL,
  `trip_id` int NOT NULL,
  `status` enum('booked','cancelled') NOT NULL DEFAULT 'booked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users_trip`
--

INSERT INTO `users_trip` (`user_trip_id`, `user_id`, `trip_id`, `status`) VALUES
(1, 1, 2, 'booked'),
(2, 1, 1, 'cancelled'),
(4, 1, 6, 'booked');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `test_table`
--
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `users_trip`
--
ALTER TABLE `users_trip`
  ADD PRIMARY KEY (`user_trip_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `trip_id` (`trip_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `test_table`
--
ALTER TABLE `test_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `trip`
--
ALTER TABLE `trip`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users_trip`
--
ALTER TABLE `users_trip`
  MODIFY `user_trip_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `users_trip`
--
ALTER TABLE `users_trip`
  ADD CONSTRAINT `users_trip_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_trip_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trip` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
