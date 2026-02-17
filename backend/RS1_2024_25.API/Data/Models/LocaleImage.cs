using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class LocaleImage
    {
        public int Id { get; set; }
        public string ImageUrl {  get; set; }
        [ForeignKey(nameof(Locale))]
        public int LocaleId {  get; set; }  
        public Locale? Locale { get; set; }

    }
}
