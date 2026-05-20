using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Folio.API.Models;

namespace Folio.API.Services;

public class PaymobService(IConfiguration config, IHttpClientFactory httpClientFactory)
{
    private readonly string _apiKey = config["Paymob:ApiKey"]!;
    private readonly string _integrationId = config["Paymob:IntegrationId"]!;
    private readonly string _iframeId = config["Paymob:IframeId"]!;
    private readonly string _hmacSecret = config["Paymob:HmacSecret"]!;

    private static readonly Dictionary<string, (decimal Amount, string Name)> Plans = new()
    {
        ["monthly"]    = (199_00m, "Folio Pro — Monthly"),
        ["annual"]     = (1499_00m, "Folio Pro — Annual"),
        ["payperuse"]  = (29_00m, "Folio — Single Analysis"),
    };

    public async Task<(string PaymentKey, string IframeUrl)> CreatePaymentOrder(
        string planKey, int userId, string email, string firstName, string lastName)
    {
        var client = httpClientFactory.CreateClient();
        var (amountCents, planName) = Plans[planKey];

        // Step 1: Auth token
        var authRes = await client.PostAsJsonAsync("https://accept.paymob.com/api/auth/tokens",
            new { api_key = _apiKey });
        var authData = await authRes.Content.ReadFromJsonAsync<JsonElement>();
        var authToken = authData.GetProperty("token").GetString()!;

        // Step 2: Order registration
        var orderRes = await client.PostAsJsonAsync("https://accept.paymob.com/api/ecommerce/orders", new
        {
            auth_token = authToken,
            delivery_needed = false,
            amount_cents = (int)amountCents,
            currency = "EGP",
            items = new[] { new { name = planName, amount_cents = (int)amountCents, description = planName, quantity = 1 } }
        });
        var orderData = await orderRes.Content.ReadFromJsonAsync<JsonElement>();
        var orderId = orderData.GetProperty("id").GetInt32();

        // Step 3: Payment key
        var payKeyRes = await client.PostAsJsonAsync("https://accept.paymob.com/api/acceptance/payment_keys", new
        {
            auth_token = authToken,
            amount_cents = (int)amountCents,
            expiration = 3600,
            order_id = orderId,
            billing_data = new
            {
                apartment = "NA", email, floor = "NA", first_name = firstName,
                street = "NA", building = "NA", phone_number = "NA", shipping_method = "NA",
                postal_code = "NA", city = "NA", country = "EG", last_name = lastName, state = "NA"
            },
            currency = "EGP",
            integration_id = int.Parse(_integrationId)
        });
        var payKeyData = await payKeyRes.Content.ReadFromJsonAsync<JsonElement>();
        var paymentKey = payKeyData.GetProperty("token").GetString()!;
        var iframeUrl = $"https://accept.paymob.com/api/acceptance/iframes/{_iframeId}?payment_token={paymentKey}";

        return (paymentKey, iframeUrl);
    }

    public bool VerifyHmac(Dictionary<string, string> data, string receivedHmac)
    {
        var fields = new[]
        {
            "amount_cents","created_at","currency","error_occured","has_parent_transaction",
            "id","integration_id","is_3d_secure","is_auth","is_capture","is_refunded",
            "is_standalone_payment","is_voided","order","owner","pending",
            "source_data_pan","source_data_sub_type","source_data_type","success"
        };
        var concat = string.Concat(fields.Select(f => data.GetValueOrDefault(f, "")));
        using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(_hmacSecret));
        var hash = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(concat))).ToLower();
        return hash == receivedHmac.ToLower();
    }

    public static PlanType PlanKeyToPlanType(string planKey) => planKey switch
    {
        "monthly"   => PlanType.Monthly,
        "annual"    => PlanType.Annual,
        "payperuse" => PlanType.PayPerUse,
        _           => PlanType.Free,
    };
}
