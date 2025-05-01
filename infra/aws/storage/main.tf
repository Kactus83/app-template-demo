terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_efs_file_system" "efs" {
  creation_token   = var.efs_name
  performance_mode = "generalPurpose"
  encrypted        = true

  lifecycle_policy {
    transition_to_ia = "AFTER_30_DAYS"
  }

  tags = {
    Name = var.efs_name
  }
}

resource "aws_efs_mount_target" "efs_mount" {
  file_system_id  = aws_efs_file_system.efs.id
  subnet_id       = var.subnet_id
  security_groups = var.security_groups
}

output "efs_mount_target_ip" {
  description = "Adresse IP du mount target EFS"
  value       = aws_efs_mount_target.efs_mount.ip_address
}

output "efs_file_system_id" {
  description = "ID du système de fichiers EFS"
  value       = aws_efs_file_system.efs.id
}
