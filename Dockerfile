# Use the official PostgreSQL image as a base
FROM postgres:latest

# Set environment variables for the database
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin
ENV POSTGRES_DB billetDB

# Expose the PostgreSQL port
EXPOSE 6000

# The official PostgreSQL image automatically handles initialization and startup.
# No need to specify a CMD here unless you need custom behavior.