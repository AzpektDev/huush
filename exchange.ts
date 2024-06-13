import * as libsignal from "@privacyresearch/libsignal-protocol-typescript";
import axios from "axios";
import { SignalProtocolStore } from "./SignalProtocolStore";

// Function to generate identity keys
async function generateIdentity() {
  const identityKeyPair = await libsignal.KeyHelper.generateIdentityKeyPair();
  const registrationId = await libsignal.KeyHelper.generateRegistrationId();

  return { identityKeyPair, registrationId };
}

// Function to generate prekeys
async function generatePreKeys(start, count) {
  const preKeys = [];
  for (let i = 0; i < count; i++) {
    preKeys.push(await libsignal.KeyHelper.generatePreKey(start + i));
  }
  return preKeys;
}

// Function to generate signed prekey
async function generateSignedPreKey(identityKeyPair, keyId) {
  return await libsignal.KeyHelper.generateSignedPreKey(identityKeyPair, keyId);
}

async function register(store) {
  // Call these functions during registration
  let { identityKeyPair, registrationId } = await generateIdentity();
  const preKeys = await generatePreKeys(0, 100);
  const signedPreKey = await generateSignedPreKey(identityKeyPair, 1);

  // Prepare the payload
  const payload = {
    username: `user-${Math.floor(Math.random() * 1000000)}`, // Random username
    password: "password",
    phone: "+48512658925",
    identityKey: Buffer.from(identityKeyPair.pubKey).toString("base64"),
    registrationId,
    preKeys: preKeys.map((key) => ({
      keyId: key.keyId,
      publicKey: Buffer.from(key.keyPair.pubKey).toString("base64"),
    })),
    signedPreKey: Buffer.from(signedPreKey.keyPair.pubKey).toString("base64"),
    signedPreKeySignature: Buffer.from(signedPreKey.signature).toString("base64"),
  };

  await store.put("identityKey", identityKeyPair);
  await store.put("registrationId", registrationId);
  preKeys.forEach((key) => store.put(`preKey-${key.keyId}`, key.keyPair));
  await store.put("signedPreKey", signedPreKey);

  // Send the payload to the server
  try {
    var res = await axios.post("http://localhost:3009/auth/register", payload);
    console.log(res.data);
  } catch (error) {
    console.error(error);
  }

  return {
    id: res.data.data.user.id,
    identityKeyPair,
    registrationId,
    preKeys,
    signedPreKey,
  };
}

function hexToUint8Array(hexString) {
  if (hexString.length % 2 !== 0) {
    throw "Invalid hexString";
  }
  var arrayBuffer = new Uint8Array(hexString.length / 2);

  for (var i = 0; i < hexString.length; i += 2) {
    var byteValue = parseInt(hexString.substring(i, i + 2), 16);
    arrayBuffer[i / 2] = byteValue;
  }

  return arrayBuffer;
}

async function sendEncryptedMessage(store) {
  const DESTINATION_USER = "13277862421446661";

  let destination_keys: any = await axios.post("http://localhost:3009/auth/keys", {
    user_id: DESTINATION_USER,
  });
  destination_keys = destination_keys.data.data.publicKeyStore;

  try {
    const address = new libsignal.SignalProtocolAddress(destination_keys.registration_id.toString(), 1);
    const sessionBuilder = new libsignal.SessionBuilder(store, address);

    const identityKeyUint8Array = hexToUint8Array(destination_keys.identity_key);
    const signedPreKeyPublicKeyUint8Array = hexToUint8Array(destination_keys.signed_pre_key);
    const signedPreKeySignatureUint8Array = hexToUint8Array(destination_keys.signed_pre_key_signature);
    const preKeyPublicKeyUint8Array = hexToUint8Array(destination_keys.pre_keys[0].publicKey);

    await sessionBuilder.processPreKey({
      registrationId: destination_keys.registration_id,
      identityKey: identityKeyUint8Array,
      signedPreKey: {
        keyId: 1,
        publicKey: signedPreKeyPublicKeyUint8Array,
        signature: signedPreKeySignatureUint8Array,
      },
      preKey: {
        keyId: 1,
        publicKey: preKeyPublicKeyUint8Array,
      },
    });

    const sender = new libsignal.SessionCipher(store, address);
    const plaintext = "Hello, world!";
    const buffer = new TextEncoder().encode(plaintext).buffer;

    const encrypted = await sender.encrypt(buffer);

    console.log("Encrypted message:", encrypted);

    return encrypted;
  } catch (error) {
    console.error("Error in sendEncryptedMessage:", error);
  }
}

async function receiveEncryptedMessage(encryptedMessage, store) {
  try {
    const senderAddress = new libsignal.SignalProtocolAddress(encryptedMessage.registrationId.toString(), 1);
    const receiver = new libsignal.SessionCipher(store, senderAddress);

    const decryptedMessage = await receiver.decryptPreKeyWhisperMessage(encryptedMessage.body, 'binary');

    // Convert ArrayBuffer to string
    const decoder = new TextDecoder('utf-8');
    const plaintext = decoder.decode(decryptedMessage);

    console.log("Decrypted message:", plaintext);

    return plaintext;
  } catch (error) {
    console.error("Error in receiveEncryptedMessage:", error);
  }
}

async function fullFlow() {
  const store = new SignalProtocolStore();

  const hasIdentityKey = await store.get("identityKey", null);
  let user;
  if (!hasIdentityKey) {
    console.log("No identity key found. Registering...");
    user = await register(store);
  }

  const encryptedMessage = await sendEncryptedMessage(store);
  console.log(encryptedMessage);

  await receiveEncryptedMessage(encryptedMessage, store);
}

fullFlow();
