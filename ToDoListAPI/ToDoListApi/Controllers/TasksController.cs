using Microsoft.AspNetCore.Authorization;
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
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<List<TaskDTO>>> GetAllTasks()
        {
            var tasks = await _context.Tasks
                .Select(t => new TaskDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted
                })
                .ToListAsync();
                        return Ok(tasks);

        }

        // Fix for the CS1061 error in the GetTaskById method
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDTO>> GetTaskById(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            var taskDTO = new TaskDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted
            };

            return Ok(taskDTO);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskDTO>> CreateTask(TaskWriteDTO taskDto)
        {
            var taskEntity = new Tasks
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                IsCompleted = taskDto.IsCompleted
            };

            _context.Tasks.Add(taskEntity);
            await _context.SaveChangesAsync();

            var taskReadDto = new TaskDTO
            {
                Id = taskEntity.Id, 
                Title = taskEntity.Title,
                Description = taskEntity.Description,
                IsCompleted = taskEntity.IsCompleted
            };

            return CreatedAtAction(
                nameof(GetTaskById),
                new { id = taskEntity.Id },
                taskReadDto
            );
        }


        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskWriteDTO dto)
        {
            var existingTask = await _context.Tasks.FindAsync(id);
            if (existingTask == null) return NotFound();

            existingTask.Title = dto.Title;
            existingTask.Description = dto.Description;
            existingTask.IsCompleted = dto.IsCompleted;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
