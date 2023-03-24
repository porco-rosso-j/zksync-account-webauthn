import {MerkleTree} from 'merkletreejs';
import {ethers} from 'ethers';
import keccak256 from 'keccak256';


const newMerkleTree = (stringPasswords: string[]) => {
    let passwords = [];
   
    for (let i = 0; i < stringPasswords.length; i++) {
      const password = ethers.utils.solidityKeccak256(['string'], [stringPasswords[i]]);
      passwords.push(password);
    };
   
    return new MerkleTree(passwords, keccak256, { sortPairs: true });
  }
   
  const newMerkleRoot = (stringPasswords: string[]) => {
    const tree = newMerkleTree(stringPasswords);
    return tree.getHexRoot().toString();
  };
   
  const newMerkleProof = (stringPasswords: string[], password: string) => {
    const tree = newMerkleTree(stringPasswords);
    return tree.getHexProof(password).toString();
  };
   
  export {
    newMerkleTree,
    newMerkleRoot,
    newMerkleProof
  }