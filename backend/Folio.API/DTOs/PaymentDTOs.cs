namespace Folio.API.DTOs;

public record CreateOrderRequest(string Plan); // "monthly" | "annual" | "payperuse"
public record CreateOrderResponse(string PaymentKey, string IframeUrl, int OrderId);
public record PaymobCallbackRequest(string Hmac, string obj, string type);
