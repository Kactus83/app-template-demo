terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.28.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_filestore_instance" "filestore" {
  name     = var.filestore_name
  tier     = "STANDARD"
  location = var.zone

  file_shares {
    name        = "deployment_vol"   
    capacity_gb = var.filestore_capacity_gb
  }

  networks {
    network = "default"
    modes   = ["MODE_IPV4"]
  }
}

output "filestore_ip" {
  description = "Première IP attribuée à l'instance Filestore"
  value       = google_filestore_instance.filestore.networks[0].ip_addresses[0]
}
