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

resource "aws_db_instance" "db_instance" {
  identifier              = var.sql_instance_name
  engine                  = "postgres"
  engine_version          = var.sql_database_version
  instance_class          = var.sql_instance_class
  allocated_storage       = var.allocated_storage
  storage_type            = "gp2"
  username                = var.db_username
  password                = var.db_password
  db_name                 = var.database_name
  vpc_security_group_ids  = var.security_groups
  publicly_accessible     = true
  skip_final_snapshot     = true

  tags = {
    Name = var.sql_instance_name
  }
}

output "db_instance_endpoint" {
  description = "Endpoint de l'instance RDS PostgreSQL"
  value       = aws_db_instance.db_instance.address
}

output "db_instance_port" {
  description = "Port de l'instance RDS PostgreSQL"
  value       = aws_db_instance.db_instance.port
}
