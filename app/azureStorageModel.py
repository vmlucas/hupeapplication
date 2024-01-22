from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient



def getClient():
    account_url = "https://victormrlucasformula1dl.blob.core.windows.net"
    default_credential = DefaultAzureCredential()

    # Create the BlobServiceClient object
    blob_service_client = BlobServiceClient(account_url, credential=default_credential)
    container_client = blob_service_client.get_container_client("hupe-docs")
    
    return container_client 


def listFiles():
    list = []  
    blobs = getClient().list_blobs()
    for blob in blobs:
        list.append({
           "name": blob.name
        })
    return list


def uploadGCStorage(file):
    bucket_name = "hupeapp"  
    #path = '/' + bucket_name + '/' + str(secure_filename(file.filename))
    bucket = getClient().bucket(bucket_name)
    blob = bucket.blob(file.filename)
    blob.content_type = 'application/pdf'
    blob.upload_from_file(file)
    
         
