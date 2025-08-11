using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListApi.Data;
using ToDoListApi.DTO;
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

        [HttpGet("{taskId}")]
        public async Task<ActionResult<List<CommentOnTask>>> GetAllComments(int taskId)
        {
            var taskExists = await _context.Tasks.AnyAsync(t => t.Id == taskId);
            var comments = new List<CommentOnTask>();
            if (taskExists)
            {
                comments = await _context.Comments.Where(c => c.TaskId == taskId)
                    .ToListAsync();
            }

            return Ok(comments);
        }

        [HttpGet("commentById/{commentId}")]
        public async Task<ActionResult<CommentOnTask>> GetCommentById(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null) return NotFound();
            return Ok(comment);
        }


        [HttpPost()]
        public async Task<ActionResult<CommentOnTaskDTO>> CreateComment(CreateCommentDTO createCommentDTO)
        {
            if (createCommentDTO.ParentCommentId.HasValue && createCommentDTO.ParentCommentId.Value != -1)
            {
                var parentComment = await _context.Comments
                    .FirstOrDefaultAsync(c => c.Id == createCommentDTO.ParentCommentId.Value);

                if (parentComment == null)
                {
                    return NotFound("El comentario padre no existe");
                }
            }

            var comment = new CommentOnTask
            {
                Comment = createCommentDTO.Comment,
                ParentCommentId = createCommentDTO.ParentCommentId == -1 ? null : createCommentDTO.ParentCommentId,
                TaskId = createCommentDTO.taskId,
                isUpdated = false
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCommentById), new { commentId = comment.Id }, MapToDto(comment));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDTO updateCommentDTO)
        {
            if (id != updateCommentDTO.Id)
                return BadRequest("");

            var existingComment = await _context.Comments.FindAsync(id);
            if (existingComment == null) return NotFound();

            existingComment.Comment = updateCommentDTO.Comment;
            existingComment.isUpdated = true;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static CommentOnTaskDTO MapToDto(CommentOnTask comment)
        {
            return new CommentOnTaskDTO
            {
                Id = comment.Id,
                Comment = comment.Comment,
                taskId = comment.TaskId,
                isUpdated = comment.isUpdated,
                ParentCommentId = comment.ParentCommentId,
                Replies = comment.Replies.Select(MapToDto).ToList()
                
            };
        }

    }


}
