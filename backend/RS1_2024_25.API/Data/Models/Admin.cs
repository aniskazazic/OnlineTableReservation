using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [Table("Admins")]
    public class Admin:MyAppUser
    {
    }
}
