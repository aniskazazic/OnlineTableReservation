using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Favourite
    {
        public int Id { get; set; }

        [ForeignKey(nameof(LocaleId))]
        public int LocaleId { get; set; }
        public Locale Locale { get; set; }

        [ForeignKey(nameof(UserId))]
        public int UserId { get; set; }
        public MyAppUser User { get; set; }

        public DateTime DateAdded { get; set; }=DateTime.Now;
        public bool IsActive { get; set; }
    }
}
