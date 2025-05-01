terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# Récupère la dernière Amazon Linux 2
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "app_vm" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = var.security_groups
  key_name                    = var.compute_key_name
  associate_public_ip_address = true

  tags = {
    Name = var.instance_name
  }

  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Mise à jour, installation Docker et EFS utils
    yum update -y
    yum install -y amazon-efs-utils docker

    systemctl enable docker
    systemctl start docker

    # Prépare le point de montage
    mkdir -p ${var.mount_point}

    # Monte automatiquement l'EFS via fstab
    echo "${var.efs_mount_target_ip}:${var.filestore_export_path} ${var.mount_point} nfs4 defaults,_netdev 0 0" >> /etc/fstab
    mount -a
  EOF
}

output "instance_name" {
  description = "Nom de l'instance EC2 (tag Name)"
  value       = aws_instance.app_vm.tags["Name"]
}

output "public_ip" {
  description = "Adresse IP publique de la VM"
  value       = aws_instance.app_vm.public_ip
}
