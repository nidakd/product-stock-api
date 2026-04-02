using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ProductStockApi.Data;

public static class DatabaseBootstrapper
{
    public static async Task EnsureDatabaseCreatedAsync(AppDbContext context)
    {
        var connectionString = context.Database.GetDbConnection().ConnectionString;
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Database connection string is missing.");
        }

        var builder = new NpgsqlConnectionStringBuilder(connectionString);
        var databaseName = builder.Database;

        if (string.IsNullOrWhiteSpace(databaseName))
        {
            throw new InvalidOperationException("Database name is missing in the connection string.");
        }

        builder.Database = "postgres";

        await using var connection = new NpgsqlConnection(builder.ConnectionString);
        await connection.OpenAsync();

        await using var existsCommand = new NpgsqlCommand("SELECT 1 FROM pg_database WHERE datname = @databaseName", connection);
        existsCommand.Parameters.AddWithValue("databaseName", databaseName);

        var databaseExists = await existsCommand.ExecuteScalarAsync() is not null;
        if (databaseExists)
        {
            return;
        }

        var createDatabaseSql = $"CREATE DATABASE \"{databaseName.Replace("\"", "\"\"")}\"";
        await using var createCommand = new NpgsqlCommand(createDatabaseSql, connection);
        await createCommand.ExecuteNonQueryAsync();
    }
}