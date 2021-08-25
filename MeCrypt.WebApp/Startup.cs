using MeCrypt.BusinessLogic;
using MeCrypt.DataAccess;
using MeCrypt.DataAccess.EF;
using MeCrypt.DataObjects.DTOs;
using MeCrypt.WebApp.Code.Base;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace MeCrypt
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>(); // ce face?

            services.AddControllersWithViews();

            services.AddAutoMapper(options =>
            {
                options.AddMaps(typeof(Startup), typeof(BaseService));
            });

            services.AddScoped<UnitOfWork>(); // de ce? - sa stiu sa explic

            var key = Encoding.ASCII.GetBytes(Configuration.GetValue<string>("AppSettings:Secret"));

            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwt => 
            {
                jwt.RequireHttpsMetadata = false;
                jwt.SaveToken = true;
                jwt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddDbContext<MeCryptContext>(options =>
            {
                options.UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"]);
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddScoped(s =>
            {
                var accessor = s.GetService<IHttpContextAccessor>();
                var httpContext = accessor.HttpContext;

                var userIdClaim = httpContext.User.FindFirst("Id")?.Value;
                var isParsingSuccessful = Guid.TryParse(userIdClaim, out Guid id);

                
                return new CurrentUserDto
                {
                    Id = id,
                    IsAuthenticated = httpContext.User.Identity.IsAuthenticated,
                    Email = httpContext.User.Identity.Name,
                    Permissions = httpContext.User.FindAll("Permission")?.Select(u => Int32.Parse(u.Value)).ToList()
                };
            });

            services.AddScoped<ControllerDependencies>();
            services.AddScoped<ServiceDependencies>();
            services.AddScoped<UserAccountService>();
            services.AddScoped<UsersService>();
            services.AddScoped<AdminService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
