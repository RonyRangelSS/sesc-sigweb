import os
import json
import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

STRAPI_URL = "http://localhost:1337"
STRAPI_TOKEN = "7a83f8f7cdc8a9ce45c7dea62918e93973b0b87b0e2582ba705671fdb422e2f3884865992dd710462b1ba91255972bd9a2538e6bbc7fd2b0c0d054b527d5ce1e0caf90eef35b1b7ea7269a35e2b14b333f741a322be85a916a39c88188b7bb2b65eede2d0eb2d4201eea9b274e40824c7ec3b162ccbbe7e51f389e0a3666631f"

ROOT_FOLDER = r"C:\Users\RONNY R\Downloads\todo mangabeira"

headers = {
    "Authorization": f"Bearer {STRAPI_TOKEN}"
}

# ------------------------------------------------------

def upload_image(image_path):
    url = f"{STRAPI_URL}/api/upload"
    image_path = os.path.abspath(image_path)
    file_name = os.path.basename(image_path)

    with open(image_path, "rb") as file:
        files = {
            "files": (file_name, file, "image/jpeg")
        }
        response = requests.post(url, files=files, headers=headers)

    if response.status_code not in (200, 201):
        print("Erro no upload:", response.text)
        return None

    uploaded = response.json()
    return uploaded[0]["id"]

# ------------------------------------------------------

def create_post(data, image_id=None):
    url = f"{STRAPI_URL}/api/posts"
    
    payload = {
        "data": {
            "titulo": data.get("empreendimento"),
            "endereco": data.get("endereco"),
            "observacao": data.get("observacao"),
            "minibio": data.get("minibio"),
            "descricaoServicos": data.get("descricaoServicos"),
            "redesSociais": data.get("redesSociais"),
            "empreendedor": data.get("empreendedor")
        }
    }

    if image_id:
        payload["data"]["imagem"] = image_id

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code not in (200, 201):
        print("Erro ao criar post:", response.text)
    else:
        print("Post criado com sucesso")

# ------------------------------------------------------

def process_folder(folder_path):
    json_file = None

    for f in os.listdir(folder_path):
        if f.lower().endswith(".json"):
            json_file = os.path.join(folder_path, f)
            break

    if not json_file:
        print("Nenhum JSON encontrado em", folder_path)
        return

    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    image_file = None
    for f in os.listdir(folder_path):
        if f.lower().endswith((".jpeg", ".jpg", ".png")):
            image_file = os.path.join(folder_path, f)
            break

    image_id = None
    if image_file:
        image_id = upload_image(image_file)
    else:
        print("Sem imagem em", folder_path)

    create_post(data, image_id)

# ------------------------------------------------------

def main():
    for folder in os.listdir(ROOT_FOLDER):
        abs_path = os.path.join(ROOT_FOLDER, folder)
        
        if os.path.isdir(abs_path):
            print("Processando pasta:", folder)

            try:
                process_folder(abs_path)
            except Exception as e:
                print("Erro:", e)

# ------------------------------------------------------

if __name__ == "__main__":
    main()
