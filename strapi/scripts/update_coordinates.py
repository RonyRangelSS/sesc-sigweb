import requests
from shapely.geometry import shape
from pyproj import Transformer
import unicodedata
import json

WFS_URL = "http://localhost:8080/geoserver/sesc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sesc%3Aestabelecimentos&outputFormat=application%2Fjson"
STRAPI_URL = "http://localhost:1337/api/empreendimentos"
STRAPI_TOKEN = "6ae9a0ceb94228a23300ef2379d93eaabb725238678818879de6593dfa53e229ca4c952a2ecd840b79a597d53caf7b0a78ce045c7fdbd4387aa566735d2c4eed4062eafdf57627b22621237759607bb1b3c02eb18c89c204d08a62136c9461815bd13fd21862bc6d39bb9cb3fba9e4ef8e62a264e02d6334f35d089daabf4e8d"

converter = Transformer.from_crs("EPSG:4326", "EPSG:4326", always_xy=True)

def limpar(v):
    if not v: return None
    if isinstance(v, str):
        return unicodedata.normalize("NFKD", v).encode("ascii","ignore").decode("utf8")
    return v

headers = {
    "Authorization": f"Bearer {STRAPI_TOKEN}",
    "Content-Type": "application/json"
}

print("\n>>> Buscando empreendimentos do Strapi...")
strapi = requests.get(STRAPI_URL+"?pagination[limit]=1000", headers=headers).json()

mapa_strapi = {}

for item in strapi["data"]:
    # suporta os dois formatos do Strapi
    attrs = item.get("attributes", item)
    nome = attrs.get("nome")

    mapa_strapi[nome] = item["documentId"]

print(f"Encontrados {len(mapa_strapi)} no Strapi")

print("\n>>> Buscando GeoServer...")
geo = requests.get(WFS_URL).json()

for feat in geo["features"]:
    props = {k: limpar(v) for k,v in feat["properties"].items()}
    
    nome = props.get("estabeleci")
    if not nome: continue

    geom = feat.get("geometry")
    if not geom: continue

    s = shape(geom)
    centro = s.centroid
    lng, lat = centro.x, centro.y

    payload = {
        "data": {
            "localizacao":{
                "lat": lat,
                "lng": lng,
                "geohash": ""
            }
        }
    }

    if nome in mapa_strapi:
        id_strapi = mapa_strapi[nome]
        url = f"{STRAPI_URL}/{id_strapi}"

        r = requests.put(url, headers=headers, json=payload)
        print(f"UPDATE {nome} -> {r.status_code}")
