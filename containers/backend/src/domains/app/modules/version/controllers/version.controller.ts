import { Controller, Get, Put, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VersionService } from '../services/version.service';
import { VersionDto } from '../models/dto/version.dto';

/**
 * @module VersionController
 * @description
 * Contrôleur pour la gestion des versions du backend et du frontend.
 * Expose les endpoints GET pour récupérer et PUT pour mettre à jour la version.
 */
@ApiTags('APP - Version')
@Controller('')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  /**
   * Récupère la version actuelle du backend et du frontend.
   *
   * @returns Les versions actuelles.
   */
  @Get()
  @ApiOperation({ summary: 'Get current backend and frontend versions' })
  @ApiResponse({ status: 200, description: 'Versions retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getVersion() {
    try {
      return await this.versionService.getVersion();
    } catch (error) {
      throw new HttpException('Failed to retrieve version.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Met à jour les versions du backend et du frontend.
   *
   * @param versionDto - Données de mise à jour des versions.
   * @returns Les versions mises à jour.
   */
  @Put()
  @ApiOperation({ summary: 'Update backend and frontend versions' })
  @ApiResponse({ status: 200, description: 'Versions updated successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateVersion(@Body() versionDto: VersionDto) {
    try {
      return await this.versionService.updateVersion(versionDto);
    } catch (error) {
      throw new HttpException('Failed to update version.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
