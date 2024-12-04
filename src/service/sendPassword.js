const nodemailer = require("nodemailer");

async function sendEmailPassword(email, message) {
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
    subject: "Mật khẩu của bạn",
    text: message,
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

module.exports = sendEmailPassword;
