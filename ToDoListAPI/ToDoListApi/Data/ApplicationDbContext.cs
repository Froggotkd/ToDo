using Microsoft.EntityFrameworkCore;
using ToDoListApi.Models;

namespace ToDoListApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
           
            

        }


        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<CommentOnTask> Comments { get; set; }

    }
}
