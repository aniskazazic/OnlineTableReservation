using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [Table("Owners")]
    public class Owner :MyAppUser
    {
        public DateTime BirthDate { get; set; }
        public string PhoneNumber { get; set; }
        
        public bool? IsVerified { get; set; }
    }
}
