package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    @Async
    public void sendOrderReceipt(Order order, String toEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Hóa đơn đơn hàng #" + order.getId() + " - Ecommerce Mini");

            StringBuilder content = new StringBuilder();
            content.append("<html><body>");
            content.append("<h2>Cảm ơn bạn đã mua hàng tại Ecommerce Mini!</h2>");
            content.append("<p>Mã đơn hàng: <b>#").append(order.getId()).append("</b></p>");
            content.append("<p>Ngày đặt: ").append(order.getCreatedAt()).append("</p>");
            content.append("<hr/>");
            content.append("<table border='1' style='border-collapse: collapse; width: 100%;'>");
            content.append("<tr style='background-color: #f2f2f2;'><th>Sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Thành tiền</th></tr>");

            for (OrderItem item : order.getItems()) {
                double subTotal = item.getPrice() * item.getQuantity();
                content.append("<tr>");
                content.append("<td style='padding: 8px;'>").append(item.getProduct().getName()).append("</td>");
                content.append("<td style='padding: 8px; text-align: center;'>").append(item.getQuantity()).append("</td>");
                content.append("<td style='padding: 8px; text-align: right;'>").append(String.format("%,.0f", item.getPrice())).append(" VND</td>");
                content.append("<td style='padding: 8px; text-align: right;'>").append(String.format("%,.0f", subTotal)).append(" VND</td>");
                content.append("</tr>");
            }

            content.append("</table>");
            content.append("<p style='text-align: right; font-size: 18px;'><b>Tổng cộng: ").append(String.format("%,.0f", order.getTotalPrice())).append(" VND</b></p>");
            content.append("<hr/>");
            content.append("<p>Địa chỉ giao hàng: ").append(order.getShippingStreet()).append(", ").append(order.getShippingCity()).append("</p>");
            content.append("<p>Số điện thoại: ").append(order.getShippingPhoneNumber()).append("</p>");
            content.append("<p>Chúng tôi sẽ sớm liên hệ để giao hàng cho bạn.</p>");
            content.append("</body></html>");

            helper.setText(content.toString(), true);
            mailSender.send(message);

        } catch (MessagingException e) {
            // Log error
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
