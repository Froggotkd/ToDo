namespace ToDoListApi.Models
{
    public class CommentOnTask
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public bool isUpdated { get; set; }

        public int? TaskId { get; set; }
        public Tasks Task { get; set; }
        public int? ParentCommentId { get; set; }
        public CommentOnTask ParentComment { get; set; }
        public List<CommentOnTask> Replies { get; set; }
    }
}
