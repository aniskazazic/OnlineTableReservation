using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Table
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey(nameof(Locale))]
        public int LocaleID {  get; set; }
        public Locale? Locale { get; set; }

        public int NumberOfGuests {  get; set; }

        public int XCoordinate { get; set; }
        public int YCoordinate { get; set; }
    }
}
