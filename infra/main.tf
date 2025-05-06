# Pour récupérer l’ID du compte
data "aws_caller_identity" "current" {}

# Récupérer le VPC par défaut
data "aws_vpc" "default" {
  default = true
}

# Security Group pour RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "SG pour RDS ${var.project_name}-${var.environment}"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Acces PostgreSQL"
    from_port   = var.db_port
    to_port     = var.db_port
    protocol    = "tcp"
    cidr_blocks = var.db_access_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Instance RDS PostgreSQL
resource "aws_db_instance" "db" {
  identifier             = "${var.project_name}-${var.environment}-db"
  engine                 = "postgres"
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  db_name                = var.db_name
  username               = var.db_user
  password               = var.db_password
  port                   = var.db_port
  publicly_accessible    = var.db_publicly_accessible
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true
  deletion_protection    = var.db_deletion_protection
}

# Dépôts ECR
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-${var.environment}-backend"
  image_tag_mutability = "MUTABLE"
}
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-${var.environment}-frontend"
  image_tag_mutability = "MUTABLE"
}

# Rôle IAM App Runner
resource "aws_iam_role" "app_runner" {
  name = "${var.project_name}-${var.environment}-app-runner-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "build.apprunner.amazonaws.com" }
        Action    = "sts:AssumeRole"
      },
      {
        Effect    = "Allow"
        Principal = { Service = "tasks.apprunner.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess",
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
  ]
}

# CloudWatch Log Groups pour App Runner
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/aws/apprunner/${var.project_name}-${var.environment}-backend/service"
  retention_in_days = 30
}
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/aws/apprunner/${var.project_name}-${var.environment}-frontend/service"
  retention_in_days = 30
}
