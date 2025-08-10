using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ToDoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            return Ok(new { message = "GetTasks endpoint hit" });
        }
    }
}
