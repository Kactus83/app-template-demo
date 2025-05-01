import { Injectable, OnModuleInit } from '@nestjs/common';
import { VersionRepository } from '../repositories/version.repository';
import { VersionDto } from '../models/dto/version.dto';
@Injectable()
export class VersionService implements OnModuleInit {
  constructor(private readonly versionRepository: VersionRepository) {}

  async onModuleInit() {
    await this.initializeVersionConfig();
  }

  async initializeVersionConfig(): Promise<void> {
    const existingVersion = await this.versionRepository.getVersion();
    if (!existingVersion) {
      await this.versionRepository.createVersion({ backend: '1.0.0', frontend: '1.0.0' });
    }
  }

  async getVersion() {
    return this.versionRepository.getVersion();
  }

  async updateVersion(versionDto: VersionDto) {
    return this.versionRepository.updateVersion(versionDto);
  }
}
