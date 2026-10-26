from pathlib import Path
from pydantic_settings import BaseSettings

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    MODEL_PATH: Path = WORKSPACE_ROOT / "ml" / "models" / "efficientnet_b0.keras"
    MAX_UPLOAD_SIZE_BYTES: int = 15 * 1024 * 1024  # 15 MB
    ALLOWED_IMAGE_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png"}

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
