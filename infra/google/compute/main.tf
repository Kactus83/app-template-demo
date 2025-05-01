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
  zone    = var.zone
}

resource "google_compute_instance" "app_vm" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = var.boot_image
      size  = var.boot_disk_size_gb
    }
  }

  network_interface {
    network       = "default"
    access_config {}  # expose external IP
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    set -e
    apt-get update
    apt-get install -y docker.io nfs-common
    # Monte automatiquement Filestore via fstab
    echo "${var.filestore_ip}:${var.filestore_export_path} ${var.mount_point} nfs defaults 0 0" >> /etc/fstab
    mount -a
  EOF
}

output "public_ip" {
  description = "IP publique de la VM"
  value       = google_compute_instance.app_vm.network_interface[0].access_config[0].nat_ip
}
