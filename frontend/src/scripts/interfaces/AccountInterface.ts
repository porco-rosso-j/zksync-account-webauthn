export interface WebAuthn {
   credentialId: string,
    pubkey: string,
    authenticatorData: string,
    clientData: string,
    signature: string
  }
  
  export interface AccountInfo {
    AccAddress:string,
    isConnected: boolean,
    WebAuthnInfo: WebAuthn
  }

  const WebAuthnNull : WebAuthn = {
    credentialId: "",
    pubkey: "",
    authenticatorData: "",
    clientData: "",
    signature: "",
  }
  
  export const AccountInfoNull: AccountInfo = {
    AccAddress: "",
    isConnected: false,
    WebAuthnInfo: WebAuthnNull
  }

