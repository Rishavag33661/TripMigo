from dotenv import dotenv_values

# Load environment variables from .env file
env_vars = dotenv_values(".env")

# env_vars is a dictionary containing all key-value pairs from .env
print(env_vars)
