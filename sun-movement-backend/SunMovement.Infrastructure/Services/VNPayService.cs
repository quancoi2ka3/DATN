using System.Security.Cryptography;
using System.Text;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SunMovement.Core.Interfaces;
using SunMovement.Core.Models;

namespace SunMovement.Infrastructure.Services
{
    public class VNPayService : IVNPayService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<VNPayService> _logger;        // VNPay configuration
        private readonly string _tmnCode;
        private readonly string _hashSecret;
        private readonly string _baseUrl;
        private readonly string _returnUrl;
        private readonly string _ipnUrl;
        private readonly string _version;
        private readonly string _command;
        private readonly string _currCode;public VNPayService(IConfiguration configuration, ILogger<VNPayService> logger)
        {
            _configuration = configuration;
            _logger = logger;            // Load VNPay configuration with fallback values
            _tmnCode = _configuration["VNPay:TmnCode"] ?? "DEMOV210";
            _hashSecret = _configuration["VNPay:HashSecret"] ?? "RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ";
            _baseUrl = _configuration["VNPay:BaseUrl"] ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            _returnUrl = _configuration["VNPay:ReturnUrl"] ?? "http://localhost:5000/api/orders/vnpay-return";
            _ipnUrl = _configuration["VNPay:IpnUrl"] ?? "http://localhost:5000/api/orders/vnpay-ipn";
            _version = "2.1.0";
            _command = "pay";
            _currCode = "VND";
            
            _logger.LogInformation($"VNPay Service initialized with TmnCode: {_tmnCode}");
        }        public Task<string> CreatePaymentUrl(Order order, HttpContext httpContext)
        {
            try
            {
                _logger.LogInformation($"Creating VNPay payment URL for order {order.Id}");
                
                // Generate expire date (15 minutes from now)
                var createDate = DateTime.Now;
                var expireDate = createDate.AddMinutes(15);                var vnpayParams = new Dictionary<string, string>
                {
                    ["vnp_Version"] = _version,
                    ["vnp_Command"] = _command,
                    ["vnp_TmnCode"] = _tmnCode,
                    ["vnp_Amount"] = ((long)(order.TotalAmount * 100)).ToString(), // VNPay requires amount in VND cents
                    ["vnp_CurrCode"] = _currCode,
                    ["vnp_TxnRef"] = $"SM{order.Id}{DateTime.Now:yyyyMMddHHmmss}", // Make unique
                    ["vnp_OrderInfo"] = $"Thanh toan don hang {order.Id}",  // Simplified, no special chars
                    ["vnp_OrderType"] = "other",
                    ["vnp_Locale"] = "vn",
                    ["vnp_ReturnUrl"] = _returnUrl,
                    ["vnp_IpnUrl"] = _ipnUrl,  // Required parameter for VNPay
                    ["vnp_IpAddr"] = GetClientIpAddress(httpContext),
                    ["vnp_CreateDate"] = createDate.ToString("yyyyMMddHHmmss"),
                    ["vnp_ExpireDate"] = expireDate.ToString("yyyyMMddHHmmss")
                };

                // Add BankCode for QR payment if specified
                if (order.PaymentMethod?.Contains("qr", StringComparison.OrdinalIgnoreCase) == true)
                {
                    vnpayParams["vnp_BankCode"] = "VNPAYQR";
                }

                // Build query string (sorted by key for hash)
                var queryString = BuildQueryString(vnpayParams);
                
                // Create secure hash
                var secureHash = CreateSecureHash(queryString, _hashSecret);
                
                // Final payment URL
                var paymentUrl = $"{_baseUrl}?{queryString}&vnp_SecureHash={secureHash}";

                _logger.LogInformation($"VNPay payment URL created successfully for order {order.Id}");
                _logger.LogDebug($"Payment URL: {paymentUrl}");
                
                return Task.FromResult(paymentUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating VNPay payment URL for order {order.Id}");
                throw new InvalidOperationException($"Failed to create VNPay payment URL: {ex.Message}", ex);
            }
        }        public Task<VNPayPaymentResult> ProcessPaymentReturn(IQueryCollection queryParams)
        {
            try
            {
                _logger.LogInformation("Processing VNPay payment return");
                
                var vnpayParams = queryParams.ToDictionary(x => x.Key, x => x.Value.ToString());
                
                // Extract and remove secure hash from params
                var receivedHash = vnpayParams.GetValueOrDefault("vnp_SecureHash", "");
                vnpayParams.Remove("vnp_SecureHash");

                // Validate secure hash
                var queryString = BuildQueryString(vnpayParams);
                var expectedHash = CreateSecureHash(queryString, _hashSecret);

                if (!receivedHash.Equals(expectedHash, StringComparison.InvariantCultureIgnoreCase))
                {
                    _logger.LogWarning("VNPay payment return: Invalid secure hash");
                    return Task.FromResult(new VNPayPaymentResult
                    {
                        IsSuccess = false,
                        Message = "Invalid secure hash - Payment verification failed"
                    });
                }

                // Parse payment result
                var responseCode = vnpayParams.GetValueOrDefault("vnp_ResponseCode", "");
                var transactionStatus = vnpayParams.GetValueOrDefault("vnp_TransactionStatus", "");
                var isSuccess = responseCode == "00" && transactionStatus == "00";

                var result = new VNPayPaymentResult
                {
                    IsSuccess = isSuccess,
                    OrderId = vnpayParams.GetValueOrDefault("vnp_TxnRef", ""),
                    TransactionId = vnpayParams.GetValueOrDefault("vnp_TransactionNo", ""),
                    Amount = decimal.Parse(vnpayParams.GetValueOrDefault("vnp_Amount", "0")) / 100, // Convert from VND cents
                    Message = GetResponseMessage(responseCode),
                    PaymentDate = ParseVNPayDate(vnpayParams.GetValueOrDefault("vnp_PayDate", ""))
                };

                _logger.LogInformation($"VNPay payment return processed: Success={result.IsSuccess}, OrderId={result.OrderId}, TransactionId={result.TransactionId}");
                
                return Task.FromResult(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing VNPay payment return");
                return Task.FromResult(new VNPayPaymentResult
                {
                    IsSuccess = false,
                    Message = "Error processing payment result"
                });
            }
        }

        public Task<bool> ValidatePaymentCallback(IQueryCollection queryParams)
        {
            try
            {
                var vnpayParams = queryParams.ToDictionary(x => x.Key, x => x.Value.ToString());
                
                // Extract secure hash
                var secureHash = vnpayParams.GetValueOrDefault("vnp_SecureHash", "");
                vnpayParams.Remove("vnp_SecureHash");

                // Validate secure hash
                var queryString = BuildQueryString(vnpayParams);
                var expectedHash = CreateSecureHash(queryString, _hashSecret);

                return Task.FromResult(secureHash.Equals(expectedHash, StringComparison.InvariantCultureIgnoreCase));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating VNPay callback");
                return Task.FromResult(false);
            }
        }

        private string GetClientIpAddress(HttpContext httpContext)
        {
            var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();
            if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1")
            {
                ipAddress = "127.0.0.1";
            }
            return ipAddress;
        }

        private string BuildQueryString(Dictionary<string, string> parameters)
        {
            var sortedParams = parameters.OrderBy(x => x.Key).ToList();
            var queryString = string.Join("&", sortedParams.Select(x => $"{x.Key}={HttpUtility.UrlEncode(x.Value)}"));
            return queryString;
        }

        private string CreateSecureHash(string data, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var dataBytes = Encoding.UTF8.GetBytes(data);
            
            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashBytes = hmac.ComputeHash(dataBytes);
                return Convert.ToHexString(hashBytes).ToLower();
            }
        }

        private DateTime ParseVNPayDate(string vnpayDate)
        {
            if (DateTime.TryParseExact(vnpayDate, "yyyyMMddHHmmss", null, System.Globalization.DateTimeStyles.None, out var date))
            {
                return date;
            }
            return DateTime.Now;
        }

        private string GetResponseMessage(string responseCode)
        {
            return responseCode switch
            {
                "00" => "Giao dịch thành công",
                "07" => "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
                "09" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
                "10" => "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
                "11" => "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
                "12" => "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
                "13" => "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).",
                "24" => "Giao dịch không thành công do: Khách hàng hủy giao dịch",
                "51" => "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
                "65" => "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
                "75" => "Ngân hàng thanh toán đang bảo trì.",
                "79" => "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.",
                _ => "Giao dịch không thành công"
            };
        }
    }
}
