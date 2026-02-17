using RS1_2024_25.API.Data.Models.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models
{
    public class ReviewReaction
    {
        public int Id {  get; set; }

        [ForeignKey(nameof(ReviewId))]
        public int ReviewId { get; set; }
        public Review Review { get; set; }

        [ForeignKey(nameof(UserId))]
        public int UserId {  get; set; }
        public MyAppUser User { get; set; }

        public bool IsLike {  get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}
