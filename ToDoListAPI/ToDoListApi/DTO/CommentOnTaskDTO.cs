using System.ComponentModel.DataAnnotations;

namespace ToDoListApi.DTO
{
    public class CommentOnTaskDTO
    {
        public int Id { get; set; }
        public string Comment { get; set; }

        public bool isUpdated { get; set; }

        public int taskId { get; set; }
        public int? ParentCommentId { get; set; }
        public List<CommentOnTaskDTO> Replies { get; set; } = new List<CommentOnTaskDTO>();
    }

    public class CreateCommentDTO
    {
        [Required]
        public string Comment { get; set; }
        public int? ParentCommentId { get; set; }

        public bool isUpdated { get; set; }
        public int taskId { get; set; }
    }

    public class UpdateCommentDTO
    {
        [Required] public string Comment { get; set; }
        public int Id { get; set; }
        public bool isUpdated { get; set; }
    }
}
