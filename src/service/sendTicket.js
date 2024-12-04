const nodemailer = require("nodemailer");

// Cấu hình email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Chọn dịch vụ bạn sử dụng, ở đây là Gmail
  auth: {
    user: "dinhtrung0012@gmail.com", // Địa chỉ Gmail của bạn
    pass: "dbbxblwvndnvqggm",  // Mật khẩu ứng dụng Gmail (hoặc mật khẩu Gmail của bạn)
  },
});

// Hàm gửi email
async function sendTicketEmail(film, email, orderInfo, showtime, seats) {
  const mailOptions = {
    from: '"Movin Cinema""dinhtrung0012@gmail.com"',  // Địa chỉ gửi email
    to: "dinhtrung0012@gmail.com",                    // Địa chỉ nhận email (email người dùng)
    subject: "Thông tin vé đã đặt", // Tiêu đề email
    text: `
      Xin chào,

      Cảm ơn bạn đã đặt vé tại rạp chiếu phim của chúng tôi. Dưới đây là thông tin vé của bạn:

      - Phim: ${film.name}
      - Thời gian chiếu: ${showtime.start_time}
      - Ghế ngồi: ${seats.join(", ")}
      - Mã đơn hàng: ${orderInfo}

      Chúc bạn có một buổi xem phim vui vẻ!

      Trân trọng,
      Rạp chiếu phim
    `, // Nội dung email
  };

  try {
    await transporter.sendMail(mailOptions); // Gửi email
    console.log("Email đã được gửi!");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error); // In lỗi nếu có
  }
}

module.exports = sendTicketEmail;
