export interface WebAuthn {
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

