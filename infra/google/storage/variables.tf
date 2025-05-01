variable "project_id" {
  description = "L'ID du projet Google Cloud"
  type        = string
}

variable "region" {
  description = "La région Google Cloud"
  type        = string
}

variable "zone" {
  description = "La zone Google Cloud"
  type        = string
}

variable "filestore_name" {
  description = "Nom de l'instance Filestore (doit respecter le pattern autorisé)"
  type        = string
  default     = "app-filestore"
}

variable "filestore_capacity_gb" {
  description = "Capacité de stockage de Filestore (en GB)"
  type        = number
  default     = 1024
}

variable "filestore_export_path" {
  description = "Chemin d'exportation du partage NFS sur l'instance Filestore"
  type        = string
  default     = "/filestore-sandbox"
}

variable "mount_options" {
  description = "Options de montage pour le partage NFS (ex : 'rw,nfsvers=4.1')"
  type        = string
  default     = "rw,nfsvers=4.1"
}
