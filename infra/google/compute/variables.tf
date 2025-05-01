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

variable "instance_name" {
  description = "Nom de l'instance Compute"
  type        = string
  default     = "app-vm"
}

variable "machine_type" {
  description = "Type de machine (e2-medium, etc.)"
  type        = string
  default     = "e2-medium"
}

variable "boot_image" {
  description = "Image de boot (Debian family)"
  type        = string
  default     = "projects/debian-cloud/global/images/family/debian-11"
}

variable "boot_disk_size_gb" {
  description = "Taille du disque de boot (en GB)"
  type        = number
  default     = 50
}

variable "filestore_ip" {
  description = "Adresse IP du Filestore"
  type        = string
}

variable "filestore_export_path" {
  description = "Chemin exporté NFS sur Filestore"
  type        = string
}

variable "mount_point" {
  description = "Point de montage local sur la VM"
  type        = string
  default     = "/mnt/filestore"
}
