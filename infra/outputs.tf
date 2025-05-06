# Endpoint complet DB
output "db_endpoint" {
  description = "Endpoint complet PostgreSQL (host:port)"
  value       = "${aws_db_instance.db.address}:${aws_db_instance.db.port}"
}
output "db_host" {
  description = "Host de la DB"
  value       = aws_db_instance.db.address
}
output "db_port" {
  description = "Port de la DB"
  value       = aws_db_instance.db.port
}

# ECR URLs
output "ecr_backend_url" {
  description = "URI du dépôt ECR backend"
  value       = aws_ecr_repository.backend.repository_url
}
output "ecr_frontend_url" {
  description = "URI du dépôt ECR frontend"
  value       = aws_ecr_repository.frontend.repository_url
}

# IAM App Runner
output "app_runner_role_arn" {
  description = "ARN du rôle IAM pour App Runner"
  value       = aws_iam_role.app_runner.arn
}

# Données Terraform utiles
output "account_id" {
  description = "ID du compte AWS"
  value       = data.aws_caller_identity.current.account_id
}
output "aws_region" {
  description = "Région AWS utilisée"
  value       = var.aws_region
}
output "project_name" {
  description = "Nom du projet"
  value       = var.project_name
}
output "environment" {
  description = "Environnement déployé"
  value       = var.environment
}
