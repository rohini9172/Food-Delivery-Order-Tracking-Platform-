using IdentityService.Api.Models;
using IdentityService.Api.Repositories;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly TokenService _tokenService;
        private readonly PasswordHasher<ApplicationUser> _passwordHasher;

        public AuthService(IUserRepository userRepository, TokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _passwordHasher = new PasswordHasher<ApplicationUser>();
        }

        public async Task<string?> RegisterAsync(RegisterDto dto)
        {
            if (await _userRepository.UserExistsAsync(dto.Username))
                return null;

            var user = new ApplicationUser
            {
                Username = dto.Username,
                Role = dto.Role
            };

            // ✅ Hash password properly
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            await _userRepository.AddUserAsync(user);
            return "User registered successfully";
        }

        public async Task<string?> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByUsernameAsync(dto.Username);
            if (user == null) return null;

            // ✅ Verify password
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed) return null;

            return _tokenService.GenerateToken(user);
        }
    }
}
