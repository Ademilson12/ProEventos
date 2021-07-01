using Microsoft.EntityFrameworkCore;
using ProEventos.API.Models;

namespace ProEventos.API.Data
{
    public class DataContext : DbContext
    {
        /*Passando para o pai DbContext a base de dados*/
        public DataContext(DbContextOptions<DataContext> options) : base(options)  { }
        /*Referencia que vai se tornar bd*/
        public DbSet<Evento> Eventos { get; set; }
        
    }
}