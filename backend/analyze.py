
import sys
import fitz  # PyMuPDF
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def get_keywords(text):
    words = set(text.lower().split())
    return [w for w in words if len(w) > 3]

def calculate_similarity(resume_text, jd_text):
    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform([resume_text, jd_text])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    return round(similarity * 100, 2)

if __name__ == "__main__":
    resume_path = sys.argv[1]
    jd_text = sys.argv[2]

    resume_text = extract_text_from_pdf(resume_path)
    score = calculate_similarity(resume_text, jd_text)

    resume_keywords = get_keywords(resume_text)
    jd_keywords = get_keywords(jd_text)

    matched = list(set(jd_keywords) & set(resume_keywords))
    missing = list(set(jd_keywords) - set(resume_keywords))

    result = {
        "score": score,
        "matched": matched[:10],
        "missing": missing[:10]
    }

    print(json.dumps(result))


