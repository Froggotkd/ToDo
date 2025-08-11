using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ToDoListApi.Models;

namespace ToDoListApi.Controllers
{
    public record LoginDto(string UserNameOrEmail, string Password);
    public record RegisterDto(string UserName, string Email, string Password);
    public record AuthResponse(string token, DateTime expiresAt, string userName, IEnumerable<string> roles);

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;


        public AuthController(UserManager<ApplicationUser> userManager,
                         SignInManager<ApplicationUser> signInManager,
                         IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.UserNameOrEmail)
                       ?? await _userManager.FindByEmailAsync(dto.UserNameOrEmail);

            if (user == null) return Unauthorized("Credenciales inválidas");

            var pwdOk = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!pwdOk.Succeeded) return Unauthorized("Credenciales inválidas");

            var roles = await _userManager.GetRolesAsync(user);
            var token = CreateJwt(user, roles);
            return Ok(token);
        }

        // Opcional, para pruebas: registrar usuarios
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var exists = await _userManager.FindByNameAsync(dto.UserName);
            if (exists != null) return BadRequest("Usuario ya existe");

            var user = new ApplicationUser { UserName = dto.UserName, Email = dto.Email };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "User");

            var roles = await _userManager.GetRolesAsync(user);
            var token = CreateJwt(user, roles);
            return Ok(token);
        }

        private AuthResponse CreateJwt(ApplicationUser user, IEnumerable<string> roles)
        {
            var jwtSection = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["ExpiresMinutes"]!));

            var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? ""),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var jwt = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(jwt), expires, user.UserName!, roles);
        }
    }
}
