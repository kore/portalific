/* eslint-env jest */
import { encryptData, decryptData } from '../utils/encryption'

// Integration tests
describe('Encryption and decryption integration', () => {
  beforeEach(() => {
    console.error = jest.fn()
  })

  it('should successfully encrypt and decrypt data', async () => {
    const password = 'securePassword123'
    const originalData = {
      message: 'This is a test message',
      numbers: [1, 2, 3, 4, 5],
      nested: { value: 'nested value' }
    }

    // Encrypt the data
    const encrypted = await encryptData(password, originalData)
    expect(encrypted).toHaveProperty('encryptedData')

    // Decrypt the data
    const decrypted = await decryptData(password, encrypted.encryptedData)

    // The decrypted data should match the original
    expect(decrypted).toEqual(originalData)
  })

  it('should fail decryption with incorrect password', async () => {
    const password = 'correctPassword'
    const wrongPassword = 'wrongPassword'
    const originalData = { message: 'Secret information' }

    // Encrypt with correct password
    const encrypted = await encryptData(password, originalData)

    // Try to decrypt with wrong password
    const decrypted = await decryptData(wrongPassword, encrypted.encryptedData)

    // Decryption should fail
    expect(console.error).toHaveBeenCalled()
    expect(decrypted).toBeNull()
  })
})
