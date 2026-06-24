import os
from PIL import Image

def main():
    dir_path = "/home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/colecao/Prontas/Altinha"
    for name in ["Frente.jpeg", "Costas.jpeg"]:
        img_path = os.path.join(dir_path, name)
        if os.path.exists(img_path):
            img = Image.open(img_path)
            print(f"{name}: {img.size[0]}x{img.size[1]} (Format: {img.format})")
        else:
            print(f"{name} not found!")

if __name__ == "__main__":
    main()
