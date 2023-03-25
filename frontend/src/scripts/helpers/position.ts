import * as ethers from 'ethers';
import { Contract, Provider} from 'zksync-web3';
import {default as accountArtifact} from "../artifacts/Account.json"


export async function getLocationHash(_address:string):Promise<string | undefined> {
    const position = await getLocation()

    if(position) {
        // by removing the decimal points over fifth,
        // the tiny difference in position can be ignored.
        // latitude 0.0001 == 11.09m, longtitude 0.0001 == 9.12m
        const x = Math.floor(position[0] * 1e4)
        const y = Math.floor(position[1] * 1e4)

        console.log("x: ", x)
        console.log("y: ", y)

        const input = ethers.utils.toUtf8Bytes(
            (x).toString() + 
            (y).toString() + 
            _address.slice(10) 
            // _address.slice(10) as a weak salt ( address hex w/o first ten letters ),
            // can be replaced with better one..?
        )

        const positionHash = ethers.utils.keccak256(input)
        console.log("positionHash: ", positionHash)
        return positionHash;
    } 

  }

export async function getTxWithPosition(_address: string, _data:ethers.BytesLike):Promise<ethers.BytesLike | undefined> {
    const account = new Contract(
        _address, 
        accountArtifact.abi,
        new Provider("http://localhost:3050", 270)
    )

    const isPositionEnabled = await account.isPositionEnabled()
    console.log("isPositionEnabled: ", isPositionEnabled)
    const positionHash = await getLocationHash(_address)
    console.log("positionHash: ", positionHash)

    if (isPositionEnabled) {
        const abiCoder = new ethers.utils.AbiCoder();
        const txData = abiCoder.encode(["bytes32", "bytes"], [positionHash, _data])
        console.log("txData: ", txData)
        return txData
    } else {
        return _data
    }
  }

  async function getLocation():Promise<number[] | undefined> {

    if ("geolocation" in navigator) { 
      let position:any = await new Promise((resolve, reject) => { 
        navigator.geolocation.getCurrentPosition(resolve, reject);
       });
  
        return [position.coords.latitude, position.coords.longitude] 
        
    
    } else {
      console.log("Not Available")
    }
  }

  
