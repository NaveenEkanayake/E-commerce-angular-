const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function addtocartEmail(to, userName, cartItems) {
  const cartDetailsHtml = cartItems
    .map(
      (item) => `
          <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px; text-align: center;">
                  <img src="${item.imageUrls}" alt="${
        item.productName
      }" style="max-width: 80px; border-radius: 5px;" />
              </td>
              <td style="padding: 10px; text-align: center; color: #333; font-size: 14px;">
                  ${item.productName || "Unnamed Product"}
              </td>
              <td style="padding: 10px; text-align: center; color: #333; font-size: 14px;">
                  ${item.quantity}
              </td>
          </tr>
      `
    )
    .join("");

  const mailOptions = {
    from: '"EzyMart" <EzyMart_onlinemart@gmail.com>',
    to: to,
    subject: "Your Cart Details - EzyMart",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
              <h2 style="color: #333; text-align: center; margin-bottom: 20px;">EzyMart_online_mart</h2>
              <p style="color: #333; font-size: 16px;">
                  Hello <strong>${userName}</strong>,
              </p>
              <p style="color: #555; line-height: 1.6;">
                  You have added the following items to your cart:
              </p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
                  <thead>
                      <tr style="background-color: #f5f5f5; border-bottom: 1px solid #ddd;">
                          <th style="padding: 10px; text-align: center; color: #555;">Image</th>
                          <th style="padding: 10px; text-align: center; color: #555;">Name</th>
                          <th style="padding: 10px; text-align: center; color: #555;">Quantity</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${cartDetailsHtml}
                  </tbody>
              </table>
              <p style="color: #555; line-height: 1.6; margin-top: 20px;">
                  You can review your cart or proceed to checkout using the link below:
              </p>
              <p style="text-align: center; margin-top: 10px;">
                  <a href="http://localhost:5173/Cart" style="color: #ffffff; text-decoration: none; font-weight: bold; background-color: #ff6347; padding: 10px 20px; border-radius: 5px; display: inline-block;">Go to Cart</a>
              </p>
              <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
                  © 2024 EzyMart. All rights reserved.
              </p>
          </div>
      `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

module.exports = { addtocartEmail };
