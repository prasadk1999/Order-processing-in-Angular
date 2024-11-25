using Microsoft.Data.Sqlite;

namespace OrderProcessingAPI.DatabaseContext{
    public static class SequenceService
    {
        public static int GetNextSequenceValue(string connectionString, string sequenceName) 
        { 
            using (var connection = new SqliteConnection(connectionString)) 
            { 
                connection.Open(); 
                using (var transaction = connection.BeginTransaction()) 
                { 
                    var command = connection.CreateCommand(); 
                    command.Transaction = transaction; 
                    command.CommandText = $@" UPDATE sequence SET value = value + 1 WHERE name = @name; 
                                            SELECT value FROM sequence WHERE name = @name; "; 
                    command.Parameters.AddWithValue("@name", sequenceName); 
                    var nextValue = (int)(long)command.ExecuteScalar(); 
                    transaction.Commit();
                    return nextValue; 
                } 
            }
        }
    }
}