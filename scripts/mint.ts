import { JsonRpcProvider } from "ethers";
import { Wallet, Contract } from "ethers";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = "0x76053BBEeA8c1952f7884BF0Dfc2bCc6D9294d8D"; // Replace with your deployed contract address
const ABI_PATH = path.resolve(__dirname, "../artifacts/contracts/CreatorNFT.sol/CreatorNFT.json");
const TOKEN_URI = "ipfs://bafkreids24idvlbaciigsvomxvqlwt6wpt74c74lzrfnnimkf244bigbw4"; // Replace with your metadata CID

async function main(): Promise<void> {
  try {
    const { abi } = JSON.parse(fs.readFileSync(ABI_PATH, "utf8"));

    const provider = new JsonRpcProvider(process.env.ALCHEMY_API_URL);
    const wallet = new Wallet(process.env.SEPOLIA_PRIVATE_KEY!, provider);

    const contract = new Contract(CONTRACT_ADDRESS, abi, wallet);

    console.log("Calling mint...");

    const tx = await contract.mint(TOKEN_URI);
    console.log("Transaction hash:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
