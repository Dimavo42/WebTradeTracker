using TradeWebAPI.Enums;

namespace TradeWebAPI.Common
{
    public class ServiceResult<T>
    {
        public bool IsSuccess { get; set; }
        public AppStatus Status { get; set; }
        public T? Data { get; set; }

       public static ServiceResult<T> Success(T data) =>
       new() { IsSuccess = true, Status = AppStatus.Success, Data = data };

        public static ServiceResult<T> Failure(AppStatus status) =>
            new() { IsSuccess = false, Status = status };
    }
}
