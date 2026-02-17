using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Zone
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [ForeignKey(nameof(LocaleId))]
        public int LocaleId {  get; set; }
        public Locale Locale { get; set; }

        public int XCoordinate { get; set; }
        public int YCoordinate { get; set; }


        public int Width { get; set; }
        public int Height { get; set; }
    }
}
