import { ethers } from "hardhat";
import { Wallet } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { VaultService } from "./vaultUtils";

dotenv.config(); // Charger les variables d'environnement

async function main() {

  // Charger la clé privée du déployeur
  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!deployerPrivateKey) {
    throw new Error("Clé privée du déployeur non définie dans .env");
  }

  // Initialiser un Wallet avec la clé privée et le connecter au provider local
  const provider = ethers.provider;
  const deployer = new Wallet(deployerPrivateKey, provider);

  console.log("Déploiement des contrats avec l'adresse :", deployer.address);

  // 1. Déployer TokenSale
  const TokenSaleFactory = await ethers.getContractFactory("TokenSale");
  const rate = 1000; // Exemple : 1000 tokens par ETH
  const tokenSale = await TokenSaleFactory.deploy(rate);
  await tokenSale.waitForDeployment();
  console.log(`TokenSale déployé à : ${tokenSale.target}`);

  // 2. Déployer TokenContract avec le TokenSale comme initialHolder
  const TokenContractFactory = await ethers.getContractFactory("TokenContract");
  const tokenInitialSupply = ethers.parseEther("1000000"); // 1 million de tokens avec 18 décimales
  const tokenContract = await TokenContractFactory.deploy(tokenInitialSupply, tokenSale.target);
  await tokenContract.waitForDeployment();
  console.log(`TokenContract déployé à : ${tokenContract.target}`);

  // 3. Définir l'adresse du TokenContract dans TokenSale
  const setTokenTx = await tokenSale.setToken(tokenContract.target);
  await setTokenTx.wait();
  console.log(`Adresse de TokenContract définie dans TokenSale`);

  // 4. Déployer NFTContract
  const NFTContractFactory = await ethers.getContractFactory("NFTContract");
  const nftContract = await NFTContractFactory.deploy(
    "https://api.example.com/metadata/{id}.json",
    tokenContract.target
  );
  await nftContract.waitForDeployment();
  console.log(`NFTContract déployé à : ${nftContract.target}`);

  // 5. Déployer MultiVault
  const MultiVaultFactory = await ethers.getContractFactory("MultiVault");
  const multiVault = await MultiVaultFactory.deploy(tokenContract.target);
  await multiVault.waitForDeployment();
  console.log(`MultiVault déployé à : ${multiVault.target}`);

  // Sauvegarde des adresses et ABIs
  const deploymentsDir = path.join(__dirname, "../deployments/web3");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const saveDeployment = async (name: string, contract: any) => {
    const artifactPath = path.join(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`);
    if (!fs.existsSync(artifactPath)) {
      throw new Error(`L'artefact pour ${name} n'existe pas.`);
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    fs.writeFileSync(
      path.join(deploymentsDir, `${name}.json`),
      JSON.stringify({
        address: contract.target,
        abi: artifact.abi,
      }, null, 2)
    );
  };

  // Sauvegarder les informations des contrats
  await saveDeployment("TokenSale", tokenSale);
  await saveDeployment("TokenContract", tokenContract);
  await saveDeployment("NFTContract", nftContract);
  await saveDeployment("MultiVault", multiVault);

  // Sauvegarder les informations du backend
  fs.writeFileSync(
    path.join(deploymentsDir, "Backend.json"),
    JSON.stringify({
      address: deployer.address,
      privateKey: deployerPrivateKey,
    }, null, 2)
  );

  console.log("Informations sur les contrats et backend sauvegardées dans des fichiers séparés.");


  // Stocker la clé privée du déployeur dans Vault
  const vaultService = new VaultService();
  await vaultService.initializeVault("blockchain-role"); // Authentification avec le rôle AppRole

  const secretPath = "secrets/data/blockchain"; // Chemin dans Vault pour stocker les secrets

  // Stocker la clé privée et l'adresse du déployeur dans Vault
  await vaultService.storeSecret(secretPath, {
    deployerAddress: deployer.address,
    deployerPrivateKey: deployerPrivateKey,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors du déploiement:", error);
    process.exit(1);
  });
