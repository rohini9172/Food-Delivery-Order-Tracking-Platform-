using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using IdentityService.Api.Models;

namespace IdentityService.Api.Services
{
    public class TokenService
    {
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;

        public TokenService(IConfiguration config)
        {
            _key = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            _issuer = config["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is not configured.");
            _audience = config["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience is not configured.");

            if (_key.Length < 32)
                throw new InvalidOperationException("Jwt:Key must be at least 32 characters long.");
        }

        public string GenerateToken(ApplicationUser user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim("role", user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
