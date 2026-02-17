using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    [Table("Workers")]
    public class Worker : MyAppUser
    {
        public DateTime BirthDate { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime HireDate { get; set; }
        public DateTime? EndDate { get; set; }

        [ForeignKey(nameof(Locale))]
        public int LocaleId { get; set; }
        public Locale? Locale { get; set; }

    }
}
