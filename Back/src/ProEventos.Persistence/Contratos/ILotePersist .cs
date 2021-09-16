using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist 
    {
        /// <summary>
        /// Metodo get que retornara uma lista de lotes por eventoId.
        /// </summary>
        /// <param name="eventoId">Codigo chave da tabela Evento</param>
        /// <returns>Lista de lotes</returns>
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

        /// <summary>
        /// Metodos get que retornara apenas 1 lote
        /// </summary>
        /// <param name="eventoId">Codigo chave da tabela Evento</param>
        /// <param name="id">Codigo chave do meu lote</param>
        /// <returns>Apenas um lote</returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
    }
}