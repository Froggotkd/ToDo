using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
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
            var comments = await _context.Comments
                    .Where(c => c.TaskId == taskId)
                    .Select(c => new CommentOnTaskDTO
                    {
                        Id = c.Id,
                        Comment = c.Comment,
                        taskId = c.TaskId,
                        isUpdated = c.isUpdated,
                        ParentCommentId = c.ParentCommentId
                    })
                    .ToListAsync();

            return Ok(comments);

        }

        [HttpGet("commentById/{commentId}")]
        public async Task<ActionResult<CommentOnTask>> GetCommentById(int commentId)
        {
            return await _context.Comments.FindAsync(commentId) is { } comment
                ? Ok(comment)
                : NotFound();
        }

        [HttpGet("replies/{commentId}")]
        public async Task<ActionResult<List<CommentOnTask>>> GetReplies(int commentId)
        {
            var replies = await _context.Comments
                .Where(c => c.ParentCommentId == commentId)
                .ToListAsync();

            return Ok(replies);
        }



        [HttpPost()]
        public async Task<ActionResult<CommentOnTaskDTO>> CreateComment(CreateCommentDTO createCommentDTO)
        {
            if (createCommentDTO.ParentCommentId.HasValue && createCommentDTO.ParentCommentId.Value != -1)
            {
                var parentComment = await _context.Comments
                    .AnyAsync(c => c.Id == createCommentDTO.ParentCommentId.Value);

                if (!parentComment)
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            _context.Comments.Remove(comment);
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
