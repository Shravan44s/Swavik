import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host='swavik.crs88o8ew1b9.ap-south-1.rds.amazonaws.com',
        user='root',
        password='11082002',
        database='swavik_db'
    )
