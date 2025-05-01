import { Injectable } from '@nestjs/common';
import { Contract } from '@prisma/client';
import { ContractRepository } from '../repositories/contract.repository';

@Injectable()
export class ContractService {
  constructor(private readonly contractRepository: ContractRepository) {}

  /**
   * Obtient un contrat par son nom.
   * @param name Nom du contrat.
   * @returns Le contrat ou null.
   */
  async getContractByName(name: string): Promise<Contract | null> {
    return this.contractRepository.findByName(name);
  }

  /**
   * Obtient un contrat par son adresse.
   * @param address Adresse du contrat.
   * @returns Le contrat ou null.
   */
  async getContractByAddress(address: string): Promise<Contract | null> {
    return this.contractRepository.findByAddress(address);
  }

  /**
   * Liste tous les contrats.
   * @returns Liste des contrats.
   */
  async getAllContracts(): Promise<Contract[]> {
    return this.contractRepository.findAll();
  }

  /**
   * Crée un nouveau contrat.
   * @param name Nom du contrat.
   * @param address Adresse du contrat.
   * @param abi ABI du contrat.
   * @returns Le contrat créé.
   */
  async createContract(name: string, address: string, abi: any): Promise<Contract> {
    return this.contractRepository.create({ name, address, abi });
  }

  /**
   * Met à jour un contrat existant.
   * @param id ID du contrat.
   * @param data Données de mise à jour.
   * @returns Le contrat mis à jour ou null.
   */
  async updateContract(id: number, data: Partial<Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Contract | null> {
    return this.contractRepository.update(id, data);
  }

  /**
   * Supprime un contrat.
   * @param id ID du contrat.
   * @returns Le contrat supprimé ou null.
   */
  async deleteContract(id: number): Promise<Contract | null> {
    return this.contractRepository.delete(id);
  }

  /**
   * Crée ou met à jour un contrat en base de données.
   * @param name Nom du contrat.
   * @param address Adresse du contrat.
   * @param abi ABI du contrat.
   * @returns Le contrat créé ou mis à jour.
   */
  async upsertContract(name: string, address: string, abi: any): Promise<Contract> {
    return this.contractRepository.upsert({
      name,
      address,
      abi,
    });
  }
}
