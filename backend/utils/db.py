import mysql.connector
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASS'),
        database=os.environ.get('DB_NAME')
    )
