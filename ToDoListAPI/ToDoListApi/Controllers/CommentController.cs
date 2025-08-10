using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListApi.Data;
using ToDoListApi.Models;

namespace ToDoListApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentController(ApplicationDbContext context)
        {
            _context = context;
        }

        //GET /tasks/{taskId}/comments
        [HttpGet("{taskId}/comments")]
        public async Task<ActionResult<List<CommentOnTask>>>GetAllComments(int taskId)
        {
              var comments = await _context.Comments.Where(c => c.TaskId == taskId)
                .ToListAsync();

            return Ok(comments);
        }
    }
}
