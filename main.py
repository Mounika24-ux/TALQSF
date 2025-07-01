"""
FastAPI micro-service for legal-document summarisation and question-answering.

Summary pipeline (T5) is identical to the original.
QA pipeline is augmented with SBERT-based semantic retrieval so that
answers can be found even when the user's wording differs from the exact
text in the judgment.
"""

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from transformers import (
    T5Tokenizer, T5ForConditionalGeneration,
    pipeline
)
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

import torch
import os
import re
import io
import pdfplumber
from PIL import Image
import pytesseract
from db import db

  # system‑wide tesseract‑ocr must be installed

# ────────────────────────────── FastAPI & CORS ─────────────────────────────
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────── Device setup ──────────────────────────────
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ───────────────────────────── Summariser (T5) ─────────────────────────────
MODEL_NAME = "t5-small"
CKPT_DIR = "legal-summarizier-final"

# shared tokenizer
tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)

# load base model then fine‑tuned checkpoint
summ_model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
ckpt_path = os.path.join(CKPT_DIR, "checkpoint-epoch7.pt")
if not os.path.isfile(ckpt_path):
    raise FileNotFoundError(
        f"Checkpoint not found: {ckpt_path}. Make sure it exists or update CKPT_DIR.")
ckpt = torch.load(ckpt_path, map_location=DEVICE)
summ_model.load_state_dict(ckpt["model_state_dict"], strict=False)
summ_model.to(DEVICE).eval()

# ─────────────────────────── Question‑Answering models ─────────────────────
# Extractive QA pipeline (RoBERTa)
qa_pipe = pipeline(
    "question-answering",
    model="deepset/roberta-base-squad2",
    tokenizer="deepset/roberta-base-squad2",
    device=0 if DEVICE.type == "cuda" else -1,
)

# SBERT embedder for semantic retrieval (tiny and fast)
embedder = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2",
    device=DEVICE.type if DEVICE.type == "cuda" else "cpu",
)

# ────────────────────────── Summarisation hyper‑params ─────────────────────
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
MIN_FINAL_TOKENS = 480
MAX_FINAL_TOKENS = 500
MAX_CHUNK_SUMMARY_TOK = 120
DECODE_KWARGS = dict(
    num_beams=4,
    no_repeat_ngram_size=3,
    repetition_penalty=2.5,
    length_penalty=1.0,
    early_stopping=True,
)

# semantic‑retrieval parameters
DEFAULT_TOP_K = 20  # sentences to keep
_SENT_SPLIT = re.compile(r"(?<=[.?!])\s+")

# ───────────────────────────── Pydantic schemas ────────────────────────────
class SummarizeRequest(BaseModel):
    text: str

class AnswerRequest(BaseModel):
    text: str
    question: str

# ───────────────────────────────── Helpers ─────────────────────────────────

def chunk_tokens(ids, chunk_size, overlap):
    """Yield overlapping slices of token IDs."""
    step = chunk_size - overlap
    for start in range(0, len(ids), step):
        yield ids[start : start + chunk_size]

def generate_summary(ids_tensor, max_len, min_len=None):
    kwargs = dict(max_length=max_len, **DECODE_KWARGS)
    if min_len:
        kwargs["min_length"] = min_len
    out = summ_model.generate(ids_tensor.unsqueeze(0).to(DEVICE), **kwargs)
    return tokenizer.decode(out[0], skip_special_tokens=True)

def extract_decision(text: str):
    """Return simple outcome & judge name heuristics."""
    tail = text[-2500:]
    patt = r"\b(?:appeal|petition|suit)\s+is\s+(dismissed|allowed|partly allowed)"
    m = re.search(patt, tail, re.I)
    outcome = m.group(0).strip() if m else None

    judge = None
    jm = re.search(r"\bJustice\s+[A-Z][a-z]+\s+[A-Z][a-z]+", text[:2000])
    if jm:
        judge = jm.group(0)
    return {"outcome": outcome, "judge": judge}

def file_to_text(upload: UploadFile) -> str:
    """Convert PDF / image / txt upload to plain UTF‑8 text."""
    mime = upload.content_type or ""
    data = upload.file.read()

    if mime == "application/pdf":
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    if mime.startswith("image/"):
        img = Image.open(io.BytesIO(data))
        return pytesseract.image_to_string(img)
    # assume plain text or unknown – best effort decode
    return data.decode(errors="ignore")


def retrieve_relevant(text: str, question: str, top_k: int = DEFAULT_TOP_K) -> str:
    """Return top‑k semantically closest sentences to the question."""
    sentences = _SENT_SPLIT.split(text)
    if len(sentences) <= top_k * 1.5:  # small doc optimisation
        return text

    # Embed
    sent_emb = embedder.encode(
        sentences,
        batch_size=64,
        convert_to_tensor=True,
        show_progress_bar=False,
    )
    q_emb = embedder.encode(question, convert_to_tensor=True)

    sims = cosine_similarity(q_emb.cpu().unsqueeze(0), sent_emb.cpu())[0]
    top_idx = sorted(sims.argsort()[-top_k:])  # keep original order
    return " ".join(sentences[i] for i in top_idx)

# ────────────────────────────── Summariser core ────────────────────────────

def summarise_text(raw_text: str):
    ids_full = tokenizer.encode(raw_text, add_special_tokens=False)
    mini = []
    for chunk in chunk_tokens(ids_full, CHUNK_SIZE, CHUNK_OVERLAP):
        ids = tokenizer.encode("summarize: ", add_special_tokens=False) + list(chunk)
        mini.append(generate_summary(torch.tensor(ids), MAX_CHUNK_SUMMARY_TOK))

    stitched = "summarize: " + " ".join(mini)
    stitched_ids = tokenizer.encode(stitched)[:512]
    final = generate_summary(torch.tensor(stitched_ids), MAX_FINAL_TOKENS, MIN_FINAL_TOKENS)
    return final, extract_decision(raw_text)

# ───────────────────────────────── Routes ──────────────────────────────────
@app.post("/summarize")
def summarize(req: SummarizeRequest):
    summary, decision = summarise_text(req.text.strip())
    return {"summary": summary, "decision": decision}

@app.post("/summarize-file")
async def summarize_file(file: UploadFile = File(...)):
    text = file_to_text(file)
    summary, decision = summarise_text(text)
    return {"summary": summary, "decision": decision}

@app.post("/answer")
def answer(req: AnswerRequest):
    question = req.question.strip()
    context = req.text.strip()

    # enlarge semantic window when doc is large
    if len(tokenizer.encode(context)) > 450:
        context = retrieve_relevant(context, question, top_k=DEFAULT_TOP_K)

    # comparative questions need extra context
    q_lower = question.lower()
    if any(kw in q_lower for kw in ("same as", "difference between")):
        context = retrieve_relevant(req.text, question, top_k=DEFAULT_TOP_K + 5)

    # add known statute definitions if mentioned
    if "section 108" in q_lower:
        context += (
            "\nSection 108 of the Transfer of Property Act: "
            "The lessee may transfer absolutely or by way of mortgage or sub-lease "
            "the whole or any part of his interest in the property, unless a contract prohibits it."  # noqa: E501
        )

    result = qa_pipe(question=question, context=context)
    return {"answer": result["answer"], "score": result["score"]}

@app.post("/answer-file")
async def answer_file(
    file: UploadFile = File(...),
    question: str = Form(...),
):
    text = file_to_text(file)
    question = question.strip()

    if len(tokenizer.encode(text)) > 450:
        text = retrieve_relevant(text, question, top_k=DEFAULT_TOP_K)

    q_lower = question.lower()
    if any(kw in q_lower for kw in ("same as", "difference between")):
        text = retrieve_relevant(text, question, top_k=DEFAULT_TOP_K + 5)

    if "section 108" in q_lower:
        text += (
            "\nSection 108 of the Transfer of Property Act: "
            "The lessee may transfer absolutely or by way of mortgage or sub-lease "
            "the whole or any part of his interest in the property, unless a contract prohibits it."  # noqa: E501
        )

    result = qa_pipe(question=question, context=text)
    return {"answer": result["answer"], "score": result["score"]}


@app.post("/save-summary")
async def save_summary(text: str = Form(...), summary: str = Form(...)):
    document = {"text": text, "summary": summary}
    result = await db.summaries.insert_one(document)
    return {"status": "saved", "id": str(result.inserted_id)}

# ─────────────────────────────── Run hint ──────────────────────────────────
#   uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Ensure dependencies: pip install fastapi uvicorn transformers sentence-transformers scikit-learn pdfplumber pillow pytesseract