from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import genomics

app = FastAPI(
    title="GENO-BRIDGE & RENAL-PULSE Core API",
    description="Cardiorenal Trajectory and Preconception Genomic CDS Engine",
    version="1.0.0",
)

# CORS middleware to allow local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "platforms": ["RENAL-PULSE", "GENO-BRIDGE"],
        "region": "Abu Dhabi (DoH / Malaffi)",
    }

# Mount Genomics Router
app.include_router(genomics.router, prefix="/api/v1")
