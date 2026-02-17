using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public float Rating { get; set; }

        [ForeignKey(nameof(UserId))]
        public int UserId {  get; set; }    
        public MyAppUser? User { get; set; }

        [ForeignKey(nameof(LocaleId))]
        public int LocaleId { get; set; }
        public Locale? Locale { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.Now;

        //-------------------------------------------
        public bool IsDeleted { get; set; }=false;
        public DateTime? DeletedAt { get; set; }
    }
}
