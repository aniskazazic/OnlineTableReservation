namespace RS1_2024_25.API.Services;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public class MyAuthorizationAttribute : Attribute, IAuthorizationFilter
{
    private readonly bool _isAdmin;
    private readonly bool _isOwner;
    private readonly bool _isWorker;

    public MyAuthorizationAttribute(bool isAdmin = false, bool IsOwner = false, bool IsWorker = false)
    {
        _isAdmin = isAdmin;
        _isOwner = IsOwner;
        _isWorker = IsWorker;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Dobavi MyAuthService iz servisa
        var authService = context.HttpContext.RequestServices.GetService<MyAuthService>();
        if (authService == null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // Pozovi GetAuthInfo sa prosleđenim HttpContextmkmmhj
        var authInfo = authService.GetAuthInfo(context.HttpContext);
        if (authInfo == null || !authInfo.IsLoggedIn)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // Provjeri role korisnika
        if (_isAdmin && !authInfo.IsAdmin)
        {
            context.Result = new ForbidResult();
            return;
        }

        if (_isOwner && !authInfo.IsOwner)
        {
            context.Result = new ForbidResult();
            return;
        }

        if (_isWorker && !authInfo.IsWorker)
        {
            context.Result = new ForbidResult();
            return;
        }
    }

}
