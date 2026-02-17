using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models.Auth;

public class RefreshToken
{
    public int Id { get; set; }
    public string Token { get; set; } 
    public DateTime CreatedAt { get; set; } 
    public DateTime ExpiresAt { get; set; } 
    public bool IsRevoked { get; set; } 
    public string ReplacedByToken { get; set; }

    [ForeignKey(nameof(MyAppUser))]
    public int MyAppUserId { get; set; }

    public MyAppUser? MyAppUser { get; set; } // Navigation property to the user
}
