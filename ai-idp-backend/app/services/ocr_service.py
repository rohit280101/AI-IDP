# OCR service
import pytesseract
import cv2
from pdf2image import convert_from_path
from PIL import Image
import os

def preprocess_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

def extract_text_from_image(image_path: str) -> str:
    img = cv2.imread(image_path)
    processed = preprocess_image(img)
    return pytesseract.image_to_string(processed)

def extract_text(path: str) -> str:
    if path.endswith(".pdf"):
        images = convert_from_path(path)
        text = ""
        for img in images:
            text += pytesseract.image_to_string(img)
        return text
    else:
        return extract_text_from_image(path)
