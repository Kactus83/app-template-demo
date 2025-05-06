# Région AWS
variable "aws_region" {
  description = "Région AWS"
  type        = string
}

# ID du compte AWS
variable "aws_account_id" {
  description = "ID du compte AWS"
  type        = string
}

# Préfixe pour nommer les ressources
variable "project_name" {
  description = "Nom du projet (préfixe des ressources)"
  type        = string
}

# Environnement (prod, staging…)
variable "environment" {
  description = "Nom de l’environnement"
  type        = string
  default     = "prod"
}

# → Configuration RDS PostgreSQL
variable "db_name" {
  description = "Nom de la base de données"
  type        = string
}
variable "db_user" {
  description = "Utilisateur PostgreSQL"
  type        = string
}
variable "db_password" {
  description = "Mot de passe PostgreSQL"
  type        = string
  sensitive   = true
}
variable "db_port" {
  description = "Port PostgreSQL"
  type        = number
  default     = 5432
}
variable "db_instance_class" {
  description = "Type d’instance RDS"
  type        = string
  default     = "db.t3.micro"
}
variable "db_allocated_storage" {
  description = "Stockage alloué (GiB)"
  type        = number
  default     = 20
}
variable "db_publicly_accessible" {
  description = "Rendre la base accessible publiquement ?"
  type        = bool
  default     = true
}
variable "db_deletion_protection" {
  description = "Protection contre la suppression"
  type        = bool
  default     = false
}
variable "db_access_cidr_blocks" {
  description = "CIDR autorisées à se connecter à la base"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
