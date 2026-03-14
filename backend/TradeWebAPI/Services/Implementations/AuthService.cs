using TradeWebAPI.Common;
using TradeWebAPI.DTOs;
using TradeWebAPI.Entities;
using TradeWebAPI.Enums;
using TradeWebAPI.Repositories.Interfaces;
using TradeWebAPI.Services.Interfaces;

namespace TradeWebAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            IJwtTokenService jwtTokenService,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        public async Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterRequestDto request)
        {
            _logger.LogInformation("AuthService.RegisterAsync started for email: {Email}", request.Email);

            if (request == null)
            {
                _logger.LogWarning("RegisterAsync failed: request is null.");
                return ServiceResult<AuthResponseDto>.Failure(AppStatus.InvalidRequest);
            }

            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                _logger.LogWarning("RegisterAsync failed: missing required fields.");
                return ServiceResult<AuthResponseDto>.Failure(AppStatus.InvalidRequest);
            }

            var normalizedEmail = request.Email.Trim().ToLower();

            var existingUser = await _userRepository.GetByEmailAsync(normalizedEmail);
            if (existingUser != null)
            {
                _logger.LogWarning("RegisterAsync failed: user already exists for email: {Email}", normalizedEmail);
                return ServiceResult<AuthResponseDto>.Failure(AppStatus.AlreadyExists);
            }

            var user = new User
            {
                Username = request.Username.Trim(),
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User"
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var token = _jwtTokenService.GenerateToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };

            _logger.LogInformation("RegisterAsync succeeded. UserId: {UserId}, Email: {Email}", user.Id, user.Email);

            return ServiceResult<AuthResponseDto>.Success(response);
        }

        public async Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginRequestDto request)
        {
            _logger.LogInformation("AuthService.LoginAsync started for email: {Email}", request.Email);

            if (request == null)
            {
                _logger.LogWarning("LoginAsync failed: request is null.");
                return ServiceResult<AuthResponseDto>.Failure(AppStatus.InvalidRequest);
            }

            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                _logger.LogWarning("LoginAsync failed: email or password is empty.");
                return ServiceResult<AuthResponseDto>.Failure(AppStatus.InvalidRequest);
            }

            var normalizedEmail = request.Email.Trim().ToLower();

            var user = await _userRepository.GetByEmailAsync(normalizedEmail);
            if (user == null)
            {
                _logger.LogWarning("LoginAsync failed: user not found for email: {Email}", normalizedEmail);
                return ServiceResult<AuthResponseDto>.Failure(AppStatus.NotFound);
            }

            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                _logger.LogWarning("LoginAsync failed: invalid password for email: {Email}", normalizedEmail);
                return ServiceResult<AuthResponseDto>.Failure(AppStatus.Unauthorized);
            }

            var token = _jwtTokenService.GenerateToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };

            _logger.LogInformation("LoginAsync succeeded. UserId: {UserId}, Email: {Email}", user.Id, user.Email);

            return ServiceResult<AuthResponseDto>.Success(response);
        }
    }
}