variable "project_id" {
  description = "L'ID du projet Google Cloud"
  type        = string
}

variable "region" {
  description = "La région Google Cloud"
  type        = string
}

variable "sql_instance_name" {
  description = "Nom de l'instance Cloud SQL"
  type        = string
  default     = "app-database"
}

variable "sql_database_version" {
  description = "Version de Cloud SQL"
  type        = string
  default     = "POSTGRES_16"
}

variable "sql_tier" {
  description = "Tier de l'instance Cloud SQL"
  type        = string
  default     = "db-n1-standard-1"
}

variable "database_name" {
  description = "Nom de la base de données"
  type        = string
  default     = "app_database"
}
