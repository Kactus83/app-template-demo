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

resource "google_sql_database_instance" "db_instance" {
  name             = var.sql_instance_name
  database_version = var.sql_database_version
  region           = var.region

  settings {
    tier = var.sql_tier
    ip_configuration {
      authorized_networks {
        name  = "sandbox"
        value = "0.0.0.0/0"  # À restreindre en production
      }
    }
  }
}

resource "google_sql_database" "default_db" {
  depends_on = [google_sql_database_instance.db_instance]
  name       = var.database_name
  instance   = google_sql_database_instance.db_instance.name
}

output "cloud_sql_connection_name" {
  description = "Nom complet de connexion pour Cloud SQL, à utiliser par l'application"
  value       = google_sql_database_instance.db_instance.connection_name
}

output "cloud_sql_public_ip" {
  description = "Adresse IP publique de l'instance Cloud SQL"
  value       = google_sql_database_instance.db_instance.public_ip_address
}
