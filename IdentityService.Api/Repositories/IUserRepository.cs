using IdentityService.Api.Models;

namespace IdentityService.Api.Repositories
{
    public interface IUserRepository
    {
        Task<ApplicationUser?> GetByUsernameAsync(string username);
        Task AddUserAsync(ApplicationUser user);
        Task<bool> UserExistsAsync(string username);
    }
}
