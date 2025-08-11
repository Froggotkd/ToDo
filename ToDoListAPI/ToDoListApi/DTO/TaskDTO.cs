namespace ToDoListApi.DTO
{
    public class TaskDTO // read and update
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class TaskWriteDTO // write
    {
        public required string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
    }
}
