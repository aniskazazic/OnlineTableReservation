using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        [ForeignKey(nameof(UserId))]
        public int UserId { get; set; }
        public MyAppUser User { get; set; }

        [ForeignKey(nameof(TableId))]
        public int TableId { get; set; }
        public Table Table { get; set; }

        public DateTime ReservationDate { get; set; }

        public TimeSpan StartTime { get; set; } 
        public TimeSpan EndTime { get; set; }  

    }

}
