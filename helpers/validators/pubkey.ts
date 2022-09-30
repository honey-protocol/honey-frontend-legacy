import { Keypair, PublicKey } from "@solana/web3.js";
import { coerce, instance, string } from "superstruct";
import * as Yup from "yup";

export const PublicKeyFromString = coerce(
  instance(PublicKey),
  string(),
  (value) => new PublicKey(value)
);

/**
 * Yup validator for a PublicKey.
 */
export const YupPublicKey = Yup.string().test(
  "Public Key",
  "Invalid public key",
  (str) => {
    if (!str) {
      return true;
    }
    try {
      new PublicKey(str);
      return true;
    } catch (e) {
      return false;
    }
  }
);

export const YupKeypair = Yup.string().test(
  "Keypair",
  "Invalid keypair JSON",
  (str) => {
    if (!str) {
      return true;
    }
    try {
      return !!kpSeedToKP(str);
    } catch (e) {
      return false;
    }
  }
);

export const kpSeedToKP = (secretKey: string): Keypair => {
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(secretKey) as number[])
  );
};
