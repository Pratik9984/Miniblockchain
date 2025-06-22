class BlockChain {
  constructor() {
    this.chain = [];
    this.createBlock(1, '0'); // Genesis block
  }

  createBlock(proof, previousHash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: new Date().toISOString(),
      proof: proof,
      previous_hash: previousHash
    };
    this.chain.push(block);
    return block;
  }

  getPreviousBlock() {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(previousProof) {
    let newProof = 1;
    while (true) {
      const hashOperation = this.hashSha256((newProof ** 2 - previousProof ** 2).toString());
      if (hashOperation.startsWith('0000')) {
        return newProof;
      }
      newProof++;
    }
  }

  hash(block) {
    const encodedBlock = JSON.stringify(block, Object.keys(block).sort());
    return this.hashSha256(encodedBlock);
  }

  hashSha256(data) {
    return CryptoJS.SHA256(data).toString();
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (block.previous_hash !== this.hash(prevBlock)) {
        return false;
      }

      const proofCheck = this.proofOfWork(prevBlock.proof);
      if (block.proof !== proofCheck) {
        return false;
      }
    }
    return true;
  }
}

// Instantiate the blockchain
const blockchain = new BlockChain();

// UI interaction
function mineBlock() {
  const prevBlock = blockchain.getPreviousBlock();
  const proof = blockchain.proofOfWork(prevBlock.proof);
  const prevHash = blockchain.hash(prevBlock);
  const block = blockchain.createBlock(proof, prevHash);
  document.getElementById("output").textContent = "Block Mined Successfully:\n" + JSON.stringify(block, null, 4);
}

function displayBlockchain() {
  document.getElementById("output").textContent = "Full Blockchain:\n" + JSON.stringify(blockchain.chain, null, 4);
}

function checkValidity() {
  const valid = blockchain.isChainValid();
  document.getElementById("output").textContent = valid ? "Blockchain is VALID ✅" : "Blockchain is NOT VALID ❌";
}
