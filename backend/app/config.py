from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host: str = "ews_postgres"
    postgres_port: int = 5432

    ml_service_host: str = "ews_ml_service"
    ml_service_port: int = 8001

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.postgres_user}:"
            f"{self.postgres_password}@{self.postgres_host}:"
            f"{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def ml_service_url(self) -> str:
        return f"http://{self.ml_service_host}:{self.ml_service_port}"

    class Config:
        env_file = ".env"


settings = Settings()
