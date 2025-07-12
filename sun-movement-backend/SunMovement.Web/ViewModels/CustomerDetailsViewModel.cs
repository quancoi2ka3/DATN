using System.Collections.Generic;
using SunMovement.Core.Models;
using System;
using Microsoft.VisualBasic;

namespace SunMovement.Web.ViewModels
{
public class CustomerDetailsViewModel
{
    public string Id { get; set; }
    public string UserId { get => Id; set => Id = value; }
    public string FullName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsActive { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime? LastOrderDate { get; set; }
    public List<Order> Orders { get; set; } = new List<Order>();

    // Helper properties for view logic
    public string DateOfBirthDisplay => DateOfBirth.HasValue && DateOfBirth.Value != default(DateTime)
        ? DateOfBirth.Value.ToString("dd/MM/yyyy") : "Chưa cập nhật";
    public string AddressDisplay => string.IsNullOrWhiteSpace(Address) ? "Chưa cập nhật" : Address;
    public string PhoneNumberDisplay => string.IsNullOrWhiteSpace(PhoneNumber) ? "Chưa cập nhật" : PhoneNumber;
    public string CreatedAtDisplay => CreatedAt.ToString("dd/MM/yyyy HH:mm");
    public string LastLoginDisplay => LastLogin.HasValue ? LastLogin.Value.ToString("dd/MM/yyyy HH:mm") : "Chưa đăng nhập";
}
}
