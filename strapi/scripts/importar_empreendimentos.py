import requests
import unicodedata
from pyproj import Transformer
from shapely.geometry import shape
import sys
import json # Importar para formatação do JSON

sys.stdout.reconfigure(encoding='utf-8')

# Suas constantes...
WFS_URL = "http://localhost:8080/geoserver/sesc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sesc%3Aestabelecimentos&outputFormat=application%2Fjson"
STRAPI_URL = "http://localhost:1337/api/empreendimentos"
STRAPI_TOKEN = "0dacf6f7992111d0adf2df9dba978b8a5095178833017e569dc1d73bcb88304b110e8c587e1ac0e453aa4c962ff99e68c8409513fe3f1b2037842418ffa150b36ff9cd7b7cf3721e36ae3d48c8c9e254a4b974d214b24e1c33ada0a6ca00db37eba442b189f36190cc04ea986b8ce72be8f55ba7e53dd423ab1f99b6deca7423"

def limpar_texto(valor):
    if valor is None:
        return None  # Garante que None seja retornado como None
    if isinstance(valor, str):
        texto = unicodedata.normalize("NFKD", valor).encode("ascii", "ignore").decode("utf-8")
        return texto.strip() if texto.strip() else None # Retorna None se a string for vazia após a limpeza
    return valor

converter = Transformer.from_crs("EPSG:31985", "EPSG:4326", always_xy=True)

print("Buscando dados do GeoServer...")
response = requests.get(WFS_URL)

# ... (Verificação de Erro WFS)
if response.status_code != 200:
    print(f"Erro no WFS: {response.status_code}")
    print(response.text)
    exit()

response.encoding = "utf-8"
data = response.json()
# print(data) # Descomente se precisar ver a resposta bruta do WFS
features = data.get("features", [])
print(f"{len(features)} empreendimentos encontrados.")

headers = {
    "Authorization": f"Bearer {STRAPI_TOKEN}",
    "Content-Type": "application/json",
}

for f in features:
    # 1. Cria o dicionário de propriedades limpas
    props = {k: limpar_texto(v) for k, v in f.get("properties", {}).items()}
    
    # *** PONTO DE DEBUG CRÍTICO ***
    print("\n--- Novo Feature ---")
    print(f"Propriedades do GeoServer (limpas): {props}") 
    # *** O NOME DAS CHAVES NESTE PRINT DEVE SER O QUE VOCÊ USA ABAIXO ***

    # ... (Cálculo de Geometria e Projeção)
    geom = f.get("geometry")

    if not geom or not geom.get("coordinates"):
        print(f"Ignorando registro sem geometria: {props.get('Empreend_1')}")
        continue

    try:
        s = shape(geom)
        centroid = s.centroid
        x, y = centroid.x, centroid.y
    except Exception:
        # Seu fallback de coordenadas aqui
        coords = geom.get("coordinates", [])
        if isinstance(coords, list) and len(coords) > 0:
            if isinstance(coords[0], list):
                # Para geometrias de múltiplas partes (e.g., MultiPoint, Polygon)
                if isinstance(coords[0][0], list):
                    x, y = coords[0][0] # Pega o primeiro ponto do primeiro anel/parte
                else:
                    x, y = coords[0] # Pega o primeiro ponto
            else:
                x, y = coords # É um Point simples
        else:
            # Não foi possível obter coordenadas válidas
            print(f"Erro ao processar geometria para {props.get('Empreend_1')}")
            continue

    lng, lat = converter.transform(x, y)
    
    # 2. Constrói o Payload
    payload = {
    "data": {
        # Mapeamento Corrigido:
        "nome": props.get("estabeleci"),    # Corrigido de Empreend_1 para estabeleci
        "tipo": props.get("tipos_esta"),    # Corrigido de Tipo_1 para tipos_esta
        "foto": str(props.get("fotografia")),    # Corrigido de Foto_1 para fotografia
        "endereco": props.get("enderec"),    # Corrigido de Endereco para enderec
        "bairro": props.get("bairros"),      # Corrigido de Bairro para bairros
        "municipio": props.get("municipios"),# Corrigido de Municipio para municipios
        
        # O campo 'Estado' não existe na sua amostra. Usaremos None por enquanto.
        "estado": "Pernambuco", 
        
        # O campo 'Regiao' não existe na sua amostra. Usaremos None por enquanto.
        "regiao": "Nordeste",
        
        "cep": props.get("ceps"),            # Corrigido de CEP para ceps
        
        # O campo 'Pais' não existe na sua amostra. Usaremos None por enquanto.
        "pais": "Brasil",
        
        "localizacao": { 
            "lat": lat, 
            "lng": lng, 
            "geohash": "" 
        }
    }
}
    
    # *** PONTO DE DEBUG CRÍTICO ***
    print(f"Payload JSON a ser enviado: {json.dumps(payload, ensure_ascii=False, indent=2)}") 
    # *** CONFIRME SE OS VALORES ESTÃO LÁ E NÃO SÃO 'null' ***

    # 3. Envia para o Strapi
    res = requests.post(STRAPI_URL, headers=headers, json=payload)

    if res.status_code in (200, 201):
        print(f"-> SUCESSO: Inserido: {props.get('Empreend_1')}")
    else:
        # *** ESTE É O PRINT MAIS IMPORTANTE PARA O DEBUG ***
        print(f"-> ERRO ao inserir {props.get('Empreend_1')}: {res.status_code}")
        print(f"-> Resposta do Strapi: {res.text}")

print("\nImportação concluída!")