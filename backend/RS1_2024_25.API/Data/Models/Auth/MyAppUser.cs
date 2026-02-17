using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RS1_2024_25.API.Data.Models.Auth;

public class MyAppUser
{
    [Key]
    public int ID { get; set; }
    public string Username { get; set; }
    [JsonIgnore]
    public string Password { get; set; }

    // Additional properties
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string Email {  get; set; }

    //----------------
    public bool IsAdmin { get; set; }
    public bool IsOwner { get; set; }
    public bool IsWorker { get; set; }

    //------
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
}
