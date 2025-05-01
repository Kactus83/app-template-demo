variable "region" {
  description = "La région AWS, par exemple 'us-east-1'."
  type        = string
  default     = "us-east-1"
}

variable "sql_instance_name" {
  description = "Nom de l'instance RDS PostgreSQL."
  type        = string
  default     = "app-database"
}

variable "sql_database_version" {
  description = "Version de PostgreSQL à utiliser (ex : '15' pour PostgreSQL 15)."
  type        = string
  default     = "15"
}

variable "sql_instance_class" {
  description = "Classe d'instance RDS, par exemple 'db.t3.micro'."
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Stockage alloué pour l'instance RDS en Go."
  type        = number
  default     = 20
}

variable "database_name" {
  description = "Nom de la base de données à créer dans l'instance RDS."
  type        = string
  default     = "app_database"
}

variable "db_username" {
  description = "Nom d'utilisateur pour l'instance de base de données."
  type        = string
}

variable "db_password" {
  description = "Mot de passe pour l'instance de base de données."
  type        = string
  sensitive   = true
}

variable "security_groups" {
  description = "Liste des IDs des groupes de sécurité pour l'instance RDS."
  type        = list(string)
}
