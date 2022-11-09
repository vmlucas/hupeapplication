from google.cloud import storage
from oauth2client.service_account import ServiceAccountCredentials
from werkzeug.utils import secure_filename


def getGCPClient():
    #credentials = ServiceAccountCredentials.from_json_keyfile_name("hardy-magpie-203501-79da7bd7faae.json")
    client = storage.Client.from_service_account_json("./app/hardy-magpie-203501-79da7bd7faae.json")
    return client 


def listFiles():
    """Lists all the blobs in the bucket."""
    # bucket_name = "your-bucket-name"
    list = []
    # Note: Client.list_blobs requires at least package version 1.17.0.
    blobs = getGCPClient().list_blobs("hupeapp")
    for blob in blobs:
        list.append({
           "name": blob.name
        })
    return list


def uploadGCStorage(file):
    bucket_name = "hupeapp"  
    #path = '/' + bucket_name + '/' + str(secure_filename(file.filename))
    bucket = getGCPClient().bucket(bucket_name)
    blob = bucket.blob(file.filename)
    blob.content_type = 'application/pdf'
    blob.upload_from_file(file)
    
         
