const nodemailer = require("nodemailer");

// Hàm tạo mã OTP ngẫu nhiên
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 chữ số
}

// Hàm gửi email
async function sendEmailService(email) {
  const otp = generateOTP(); // Tạo mã OTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dinhtrung0012@gmail.com", // Email gửi
      pass: "dbbxblwvndnvqggm", // Mật khẩu ứng dụng của Gmail
    },
  });

  const mailOptions = {
    from: '"Movin Cinema""dinhtrung0012@gmail.com"', // Email người gửi
    to: email, // Email người nhận
    subject: "Mã OTP của bạn",
    text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
  };

  try {
    await transporter.sendMail(mailOptions); // Gửi email
    return {
      status: "success",
      message: "Email đã được gửi thành công",
      otp, // Trả về mã OTP để lưu hoặc xử lý
    };
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    return {
      status: "error",
      message: "Không thể gửi email",
    };
  }
}



module.exports = sendEmailService;

