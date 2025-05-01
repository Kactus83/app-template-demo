import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/services/prisma.service';
import { Contract, Prisma } from '@prisma/client';

@Injectable()
export class ContractRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<Contract | null> {
    return this.prisma.contract.findUnique({ where: { name } });
  }

  async findByAddress(address: string): Promise<Contract | null> {
    return this.prisma.contract.findUnique({ where: { address } });
  }

  async findAll(): Promise<Contract[]> {
    return this.prisma.contract.findMany();
  }

  async create(data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    return this.prisma.contract.create({
      data: {
        ...data,
        abi: data.abi as Prisma.InputJsonValue,
      },
    });
  }

  async update(id: number, data: Partial<Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Contract | null> {
    return this.prisma.contract.update({
      where: { id },
      data: {
        ...data,
        abi: data.abi as Prisma.InputJsonValue,
      },
    });
  }

  async delete(id: number): Promise<Contract | null> {
    return this.prisma.contract.delete({ where: { id } });
  }

  async upsert(data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract> {
    return this.prisma.contract.upsert({
      where: { name: data.name },
      update: {
        address: data.address,
        abi: data.abi as Prisma.InputJsonValue,
      },
      create: {
        name: data.name,
        address: data.address,
        abi: data.abi as Prisma.InputJsonValue,
      },
    });
  }
}
