import io
import json
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import torch.nn.functional as F
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form
from typing import List

app = FastAPI(title="ResctPet - Servicio de Similitud Visual (CBIR)")

# 1. CARGA DEL MODELO (ResNet50 preentrenado)
print("Cargando modelo ResNet50...")
modelo = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
# Quitamos la última capa clasificadora para obtener el embedding de 2048 dimensiones
extractor = torch.nn.Sequential(*list(modelo.children())[:-1])
extractor.eval()

# Preprocesamiento estándar de imágenes (Resize 224x224 y normalización ImageNet)
transformacion = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def extraer_vector(imagen_bytes: bytes):
    raw_img = Image.open(io.BytesIO(imagen_bytes)).convert('RGB')
    tensor_img = transformacion(raw_img).unsqueeze(0)
    with torch.no_grad():
        vector = extractor(tensor_img).squeeze()
    return vector

# 2. ENDPOINT PARA RANKING DE SIMILITUD COSENO (1 a N)
@app.post("/api/v1/ranking-similitud")
async def generar_ranking_similitud(
    foto_buscada: UploadFile = File(...),           # Foto subida por el usuario
    fotos_candidatas: List[UploadFile] = File(...),  # Fotos recuperadas de la BD
    metadatos_json: str = Form(...)                 # JSON con IDs de la BD
):
    # Extraer vector de la foto buscada
    bytes_buscada = await foto_buscada.read()
    vector_buscado = extraer_vector(bytes_buscada)
    
    candidatos_meta = json.loads(metadatos_json)
    ranking_resultados = []

    # Comparar contra cada foto candidata
    for i, foto_candidata in enumerate(fotos_candidatas):
        bytes_candidata = await foto_candidata.read()
        vector_candidato = extraer_vector(bytes_candidata)
        
        # CÁLCULO DE SIMILITUD COSENO
        similitud = F.cosine_similarity(vector_buscado, vector_candidato, dim=0).item()
        porcentaje = round(max(0.0, similitud) * 100, 2)
        
        ranking_resultados.append({
            "mascota_id": candidatos_meta[i]["id"],
            "similitud_porcentaje": porcentaje
        })

    # Ordenar ranking de mayor a menor porcentaje
    ranking_resultados.sort(key=lambda x: x["similitud_porcentaje"], reverse=True)

    return {
        "status": "success",
        "total_comparadas": len(ranking_resultados),
        "ranking": ranking_resultados
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "modelo": "ResNet50"}
