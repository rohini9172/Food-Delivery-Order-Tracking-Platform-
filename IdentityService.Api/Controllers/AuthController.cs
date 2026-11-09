using Microsoft.AspNetCore.Mvc;
using IdentityService.Api.Models;
using IdentityService.Api.Services;

namespace IdentityService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || dto.Username.Trim().Length < 3)
                return BadRequest(new { message = "Username must contain at least 3 non-space characters." });

            var result = await _authService.RegisterAsync(dto);
            if (result == null) return Conflict(new { message = "Username already exists." });
            return StatusCode(StatusCodes.Status201Created, new { message = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username))
                return BadRequest(new { message = "Username cannot be empty." });

            var token = await _authService.LoginAsync(dto);
            if (token == null) return Unauthorized(new { message = "Invalid username or password." });
            return Ok(new { token });
        }
    }
}
