from fastapi import FastAPI

app = FastAPI(
    title="Polar Twin API",
    description="Backend for monitoring Indian Antarctic Research Stations",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "name": "Polar Twin",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }