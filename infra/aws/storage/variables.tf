variable "region" {
  description = "La région AWS, par exemple 'us-east-1'."
  type        = string
  default     = "us-east-1"
}

variable "efs_name" {
  description = "Nom du système de fichiers EFS."
  type        = string
  default     = "efs-sandbox"
}

variable "subnet_id" {
  description = "ID du subnet dans lequel créer le mount target de l'EFS."
  type        = string
}

variable "security_groups" {
  description = "Liste des IDs des groupes de sécurité pour l'EFS."
  type        = list(string)
}
