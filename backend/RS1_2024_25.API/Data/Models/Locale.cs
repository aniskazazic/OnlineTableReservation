using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Locale
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string? Logo { get; set; }

        public TimeOnly StartOfWorkingHours {  get; set; }
        public TimeOnly EndOfWorkingHours {  get; set; }
        public double? LengthOfReservation { get; set; }

        public string? Address {  get; set; }

        [ForeignKey(nameof(CityId))]
        public int CityId { get; set; }
        public City? City { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        [ForeignKey(nameof(OwnerId))]
        public int OwnerId { get; set; }
        public Owner? Owner { get; set; }

        public bool IsDeleted { get; set; } = false;
        public DateTime? DeleteAt { get; set; }

    }
}
