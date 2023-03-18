import {Token} from '../common/Token';


export declare global {
  interface Window {
    // Removed all globals but can access them via window.__var later if need be
    // __selectedChain: string;
    // __selectedChain2: string;
    // __selectedToken: Token?;
    // __imageSelected: string; // will add icons later
    // __selectedToken2: Token?;
    // __imageSelected2: string;
    // __price1: number;
    // __price2: number;
  }
}
