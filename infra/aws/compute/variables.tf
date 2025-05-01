variable "region" {
  description = "AWS region où créer la VM"
  type        = string
}

variable "subnet_id" {
  description = "ID du Subnet pour l'instance EC2"
  type        = string
}

variable "security_groups" {
  description = "Liste des IDs des Security Groups à appliquer"
  type        = list(string)
}

variable "compute_key_name" {
  description = "Nom de la key pair AWS (pour SSH)"
  type        = string
}

variable "compute_public_key_path" {
  description = "Chemin local vers la clé publique (utilisé dans le CLI pour SCP/SSH)"
  type        = string
}

variable "efs_mount_target_ip" {
  description = "IP du mount target EFS (récupérée depuis StorageInfraData)"
  type        = string
}

variable "filestore_export_path" {
  description = "Chemin d’export EFS (ex: /)"
  type        = string
}

variable "mount_point" {
  description = "Point de montage local sur la VM"
  type        = string
  default     = "/mnt/efs"
}

variable "instance_name" {
  description = "Tag Name de l'instance EC2"
  type        = string
}

variable "instance_type" {
  description = "Type de l'instance EC2"
  type        = string
  default     = "t3.micro"
}
