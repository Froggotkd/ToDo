namespace ToDoListApi.Models
{
    public class Tasks
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }

        }
}
