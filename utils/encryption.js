/**
 * Generates a key from a password using PBKDF2
 * @param {string} password - User password
 * @param {Uint8Array} salt - Salt for key derivation
 * @returns {Promise<CryptoKey>} - Derived key
 */
export const deriveKey = async (password, salt) => {
  // Convert password string to buffer
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  // Import the password as a key
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  // Derive a key from the password
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1024, // Make this configurable by the user? CPU usage vs. security…
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypts data with AES-GCM
 * @param {string} password - User password
 * @param {Object} data - Data to encrypt
 * @returns {Promise<Object>} - Encrypted data object with iv, salt, and data
 */
export const encryptData = async (password, data) => {
  if (!password) {
    return { data }
  }

  // Generate a random salt for key derivation
  const salt = window.crypto.getRandomValues(new Uint8Array(16))

  // Generate a random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  // Derive key from password
  const key = await deriveKey(password, salt)

  // Convert data to string and then to Uint8Array
  const dataString = JSON.stringify(data)
  const dataBuffer = new TextEncoder().encode(dataString)

  // Encrypt the data
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    dataBuffer
  )

  // Convert encrypted data to base64
  const encryptedArray = new Uint8Array(encryptedBuffer)
  const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray))

  // Convert iv and salt to base64
  const ivBase64 = btoa(String.fromCharCode(...iv))
  const saltBase64 = btoa(String.fromCharCode(...salt))

  return {
    encryptedData: {
      iv: ivBase64,
      salt: saltBase64,
      data: encryptedBase64
    }
  }
}

/**
 * Decrypts data with AES-GCM
 * @param {string} password - User password
 * @param {Object} encryptedData - Object containing iv, salt, and encrypted data
 * @returns {Promise<Object>} - Decrypted data
 */
export const decryptData = async (password, encryptedData) => {
  if (
    !encryptedData ||
    !encryptedData.iv ||
    !encryptedData.salt ||
    !encryptedData.data
  ) {
    return null
  }

  try {
    // Convert base64 to Uint8Array
    const iv = new Uint8Array(
      [...atob(encryptedData.iv)].map((c) => c.charCodeAt(0))
    )
    const salt = new Uint8Array(
      [...atob(encryptedData.salt)].map((c) => c.charCodeAt(0))
    )
    const encryptedBuffer = new Uint8Array(
      [...atob(encryptedData.data)].map((c) => c.charCodeAt(0))
    )

    // Derive key from password and salt
    const key = await deriveKey(password, salt)

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encryptedBuffer
    )

    // Convert decrypted data to string and parse as JSON
    const decryptedString = new TextDecoder().decode(decryptedBuffer)
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}
