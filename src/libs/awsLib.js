import { Storage } from "aws-amplify";
import { API } from "aws-amplify";

export async function s3Upload(file,email) {
  console.log("upload do arquivo para usuario: " + email);
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
    metadata: { 'email' : email }
  });

  return stored.key;
}

export async function s3UploadPub(file) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.put(filename, file, {
    contentType: file.type
  });

  return stored.key;
}


export async function detectText(bytes) {

    console.log("Detecting Text!! " + bytes);

    const apiName = "rekognition";
    const path = "/detect-text";
    const body = { Image: { Bytes: bytes } };
  
    const headers = {
      "X-Amz-Target": "RekognitionService.DetectText",
      "Content-Type": "application/x-amz-json-1.1"
    };
  
    const init = {
      body: body,
      headers: headers
    };
    return await API.post(apiName, path, init);
}

export function parserCNH(cnh){
    return cnh.substring((cnh.indexOf("NOME")+4),cnh.indexOf("DO"))
}