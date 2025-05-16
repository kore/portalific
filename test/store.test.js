/* eslint-env jest */

import { useTestStore as useStore, API_URL, API_AUTH_HEADER } from '../utils/store'
import { encryptData, decryptData } from '../utils/encryption'
import axios from 'axios'

jest.mock('axios')

const localStorageMock = (function () {
  let store = {}
  return {
    getItem: jest.fn(key => {
      return store[key] || null
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    removeItem: jest.fn(key => {
      delete store[key]
    })
  }
})()

const window = {}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Zustand Store', () => {
  beforeEach(() => {
    localStorageMock.clear()

    // Reset the store to initial state between tests
    const { setState } = useStore
    setState({
      settings: { columns: 1 },
      modules: [[{ type: 'welcome', id: 'welcome' }]],
      errors: [],
      revision: null
    })
  })

  describe('setSettings function', () => {
    test('should update settings', () => {
      const newSettings = { columns: 2 }

      useStore.getState().setSettings(newSettings)

      expect(useStore.getState().settings).toEqual(newSettings)
    })

    test('should maintain module structure when columns increase', () => {
      const initialModules = [[{ type: 'welcome', id: 'welcome' }]]
      useStore.setState({
        settings: { columns: 1 },
        modules: initialModules
      })

      useStore.getState().setSettings({ columns: 3 })

      expect(useStore.getState().modules[0]).toEqual(initialModules[0])
      expect(useStore.getState().modules.length).toBeGreaterThanOrEqual(1)
    })

    test('should redistribute modules when columns decrease', () => {
      const modulesInThreeColumns = [
        [{ type: 'module1', id: 'mod1' }],
        [{ type: 'module2', id: 'mod2' }],
        [{ type: 'module3', id: 'mod3' }]
      ]
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesInThreeColumns
      })

      useStore.getState().setSettings({ columns: 2 })

      expect(useStore.getState().modules.length).toBeGreaterThanOrEqual(2)
      expect(useStore.getState().modules[0]).toEqual([{ type: 'module1', id: 'mod1' }])
      expect(useStore.getState().modules[1]).toEqual([{ type: 'module2', id: 'mod2' }, { type: 'module3', id: 'mod3' }])
      expect(useStore.getState().modules[2]).toEqual([])
    })

    test('should merge all modules into first column when reducing to single column', () => {
      const modulesInThreeColumns = [
        [{ type: 'module1', id: 'mod1' }],
        [{ type: 'module2', id: 'mod2' }],
        [{ type: 'module3', id: 'mod3' }]
      ]
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesInThreeColumns
      })

      useStore.getState().setSettings({ columns: 1 })

      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module2', id: 'mod2' },
        { type: 'module3', id: 'mod3' }
      ])
      expect(useStore.getState().modules[1]).toEqual([])
      expect(useStore.getState().modules[2]).toEqual([])
    })

    test('should handle null modules when reducing columns', () => {
      const modulesWithNull = [
        [{ type: 'module1', id: 'mod1' }],
        null,
        [{ type: 'module3', id: 'mod3' }]
      ]
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesWithNull
      })

      useStore.getState().setSettings({ columns: 1 })

      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module3', id: 'mod3' }
      ])
    })

    test('should filter out falsy modules during column reduction', () => {
      const modulesWithUndefined = [
        [{ type: 'module1', id: 'mod1' }],
        [undefined, { type: 'module2', id: 'mod2' }],
        [{ type: 'module3', id: 'mod3' }, null]
      ]
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesWithUndefined
      })

      useStore.getState().setSettings({ columns: 1 })

      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module2', id: 'mod2' },
        { type: 'module3', id: 'mod3' }
      ])
    })
  })

  describe('moveModule function', () => {
    test('should move module within the same column', () => {
      const initialModules = [
        [
          { type: 'module1', id: 'mod1' },
          { type: 'module2', id: 'mod2' },
          { type: 'module3', id: 'mod3' }
        ]
      ]
      useStore.setState({
        modules: initialModules
      })

      useStore.getState().moveModule(0, 0, 0, 2)

      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module2', id: 'mod2' },
        { type: 'module3', id: 'mod3' },
        { type: 'module1', id: 'mod1' }
      ])
    })

    test('should move module to a different column', () => {
      const initialModules = [
        [{ type: 'module1', id: 'mod1' }],
        [{ type: 'module2', id: 'mod2' }]
      ]
      useStore.setState({
        settings: { columns: 2 },
        modules: initialModules
      })

      useStore.getState().moveModule(0, 0, 1, 0)

      expect(useStore.getState().modules[0]).toEqual([])
      expect(useStore.getState().modules[1]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module2', id: 'mod2' }
      ])
    })

    test('should create target column array if it does not exist', () => {
      const initialModules = [
        [{ type: 'module1', id: 'mod1' }]
      ]
      useStore.setState({
        settings: { columns: 2 },
        modules: initialModules
      })

      useStore.getState().moveModule(0, 0, 1, 0)

      expect(useStore.getState().modules[0]).toEqual([])
      expect(useStore.getState().modules[1]).toEqual([
        { type: 'module1', id: 'mod1' }
      ])
    })

    test('should handle moving to a higher index in the same column', () => {
      const initialModules = [
        [
          { type: 'module1', id: 'mod1' },
          { type: 'module2', id: 'mod2' },
          { type: 'module3', id: 'mod3' }
        ]
      ]
      useStore.setState({
        modules: initialModules
      })

      useStore.getState().moveModule(0, 0, 0, 1)

      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module2', id: 'mod2' },
        { type: 'module1', id: 'mod1' },
        { type: 'module3', id: 'mod3' }
      ])
    })
  })

  describe('load function', () => {
    const API_URL = 'https://local-storage-storage.io/api/portalific/'
    const mockResponseData = {
      data: JSON.stringify({
        settings: { columns: 3, synchronize: true, identifier: 'test-id' },
        modules: [
          [{ type: 'remote1', id: 'remote1' }],
          [{ type: 'remote2', id: 'remote2' }]
        ]
      }),
      revision: '123456'
    }

    beforeEach(() => {
      axios.get.mockClear()
    })

    test('should not fetch data if synchronize is false', async () => {
      useStore.setState({
        settings: { columns: 2, synchronize: false }
      })

      await useStore.getState().load()

      expect(axios.get).not.toHaveBeenCalled()
    })

    test('should fetch and update store with remote data when synchronize is true', async () => {
      useStore.setState({
        settings: { columns: 2, synchronize: true, identifier: 'test-id' }
      })

      axios.get.mockResolvedValueOnce({ data: mockResponseData })

      await useStore.getState().load()

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}test-id`,
        { headers: API_AUTH_HEADER }
      )

      const state = useStore.getState()
      const parsedResponse = JSON.parse(mockResponseData.data)

      expect(state.settings).toEqual(parsedResponse.settings)
      expect(state.modules).toEqual(parsedResponse.modules)
      expect(state.revision).toEqual(mockResponseData.revision)
    })

    test('should handle API response correctly', async () => {
      useStore.setState({
        settings: { columns: 1, synchronize: true, identifier: 'test-id' },
        modules: [[{ type: 'local', id: 'local' }]]
      })

      const customResponse = {
        data: JSON.stringify({
          settings: { columns: 2, synchronize: true, identifier: 'test-id' },
          modules: [
            [{ type: 'api1', id: 'api1' }],
            [{ type: 'api2', id: 'api2' }]
          ]
        }),
        revision: 'abc123'
      }

      axios.get.mockResolvedValueOnce({ data: customResponse })

      await useStore.getState().load()

      const state = useStore.getState()
      const parsedResponse = JSON.parse(customResponse.data)

      expect(state.settings).toEqual(parsedResponse.settings)
      expect(state.modules).toEqual(parsedResponse.modules)
      expect(state.revision).toEqual(customResponse.revision)
    })
  })
})

describe('Store synchronization tests', () => {
  const API_URL = 'https://local-storage-storage.io/api/portalific/'

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // Initialize the store with default values
    useStore.setState({
      settings: {
        synchronize: true,
        identifier: 'test-id',
        columns: 1
      },
      modules: [[{ type: 'test', id: 'test-module' }]],
      theme: 'light',
      revision: null,
      synchronizedStateHasChanges: true
    })
  })

  test('1) If there\'s no revision use PUT', async () => {
    // Setup: ensure there's no revision
    useStore.setState({ revision: null })

    // Mock successful PUT response
    axios.put.mockResolvedValueOnce({
      data: { revision: 'new-revision-123' }
    })

    // Execute - call persist directly from the store
    await useStore.getState().persist()

    // Assert: PUT was called with correct params
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(axios.put).toHaveBeenCalledWith(
      `${API_URL}test-id`,
      expect.any(String),
      { headers: API_AUTH_HEADER }
    )

    // Verify store state was updated correctly
    const storeState = useStore.getState()
    expect(storeState.revision).toBe('new-revision-123')
    expect(storeState.synchronizedStateHasChanges).toBe(false)
  })

  test('2) If PUT is used but file exists on backend (409), should reload store', async () => {
    // Setup: ensure there's no revision
    useStore.setState({ revision: null })

    // Spy on the load method
    const originalLoad = useStore.getState().load
    const loadSpy = jest.fn(() => Promise.resolve())
    useStore.getState().load = loadSpy

    // Mock PUT to throw 409 conflict error
    const error = new Error('Conflict')
    error.response = { status: 409 }
    axios.put.mockRejectedValueOnce(error)

    // Execute - this should call load() in the catch block
    await useStore.getState().persist().catch(() => {
      // We don't care about the error here, just want to ensure the promise completes
    })

    // Assert: PUT was called
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledTimes(1)

    // Restore original method
    useStore.getState().load = originalLoad
  })

  test('3) If there\'s a revision use POST', async () => {
    // Setup: set a revision
    useStore.setState({ revision: 'existing-revision-123' })

    // Mock successful POST response
    axios.post.mockResolvedValueOnce({
      data: { revision: 'updated-revision-456' }
    })

    // Execute
    await useStore.getState().persist()

    // Assert: POST was called with correct params
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}test-id?revision=existing-revision-123`,
      expect.any(String),
      { headers: API_AUTH_HEADER }
    )

    // Verify store state was updated correctly
    const storeState = useStore.getState()
    expect(storeState.revision).toBe('updated-revision-456')
    expect(storeState.synchronizedStateHasChanges).toBe(false)
  })

  test('4) If file does not exist (404), should disable synchronization', async () => {
    // Setup: set a revision
    useStore.setState({
      revision: 'existing-revision-123',
      settings: {
        synchronize: true,
        identifier: 'test-id',
        columns: 1
      }
    })

    // Mock POST to throw 404 not found error
    const error = new Error('Not Found')
    error.response = { status: 404 }
    axios.post.mockRejectedValueOnce(error)

    // Execute
    await useStore.getState().persist().catch(() => {
      // We don't care about the error here, just want to ensure the promise completes
    })

    // Assert: POST was attempted
    expect(axios.post).toHaveBeenCalledTimes(1)

    // Verify store settings were updated correctly
    const settings = useStore.getState().settings
    expect(settings.identifier).toBe(null)
    expect(settings.password).toBe(null)
    expect(settings.synchronize).toBe(false)
  })

  test('5) If revision is wrong (409), store should be reloaded', async () => {
    // Setup: set a revision
    useStore.setState({ revision: 'existing-revision-123' })

    // Spy on the load method
    const originalLoad = useStore.getState().load
    const loadSpy = jest.fn(() => Promise.resolve())
    useStore.getState().load = loadSpy

    // Mock POST to throw 409 conflict error
    const error = new Error('Conflict')
    error.response = { status: 409 }
    axios.post.mockRejectedValueOnce(error)

    // Execute
    await useStore.getState().persist().catch(() => {
      // We don't care about the error here, just want to ensure the promise completes
    })

    // Assert: POST was called
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledTimes(1)

    // Restore original method
    useStore.getState().load = originalLoad
  })

  test('Should not sync if synchronize is false', async () => {
    // Setup: disable synchronization
    useStore.setState({
      settings: {
        synchronize: false,
        identifier: 'test-id',
        columns: 1
      }
    })

    // Execute
    await useStore.getState().persist()

    // Assert: no HTTP requests were made
    expect(axios.put).not.toHaveBeenCalled()
    expect(axios.post).not.toHaveBeenCalled()
  })

  test('Should not sync if no state changes', async () => {
    // Setup: mark state as not having changes
    useStore.setState({
      synchronizedStateHasChanges: false,
      settings: {
        synchronize: true,
        identifier: 'test-id',
        columns: 1
      }
    })

    // Execute
    await useStore.getState().persist()

    // Assert: no HTTP requests were made
    expect(axios.put).not.toHaveBeenCalled()
    expect(axios.post).not.toHaveBeenCalled()
  })
})

describe('Zustand Store encrypted synchronization tests', () => {
  beforeEach(() => {
    localStorageMock.clear()

    // Reset the store to initial state between tests
    const { setState } = useStore
    setState({
      settings: { columns: 1 },
      modules: [[{ type: 'welcome', id: 'welcome' }]],
      errors: [],
      revision: null
    })

    // Reset mocks
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  describe('loading with encryption', () => {
    beforeEach(() => {
      axios.get.mockClear()
    })

    test('1) should use unencrypted data as-is when password is set but received data is not encrypted', async () => {
      // Setup: set password in settings but return unencrypted data
      useStore.setState({
        settings: {
          columns: 2,
          synchronize: true,
          identifier: 'test-id',
          password: 'mypassword'
        }
      })

      // Mock API response with unencrypted data (no encryptedData property)
      const unencryptedData = {
        data: JSON.stringify({
          settings: { columns: 3, synchronize: true, identifier: 'test-id' },
          modules: [
            [{ type: 'remote1', id: 'remote1' }],
            [{ type: 'remote2', id: 'remote2' }]
          ]
        }),
        revision: '123456'
      }

      axios.get.mockResolvedValueOnce({ data: unencryptedData })

      // Execute
      await useStore.getState().load()

      // Verify store was updated with unencrypted data
      const state = useStore.getState()
      const parsedData = JSON.parse(unencryptedData.data)
      expect(state.settings).toEqual(parsedData.settings)
      expect(state.modules).toEqual(parsedData.modules)
      expect(state.revision).toEqual(unencryptedData.revision)
    })

    test('2) should decrypt data when password is set and data is encrypted', async () => {
      if (typeof window?.crypto?.getRandomValues !== 'function') {
        console.info("Skip test, since window.crypto.getRandomValues isn't available")
        return
      }

      // Setup: set password in settings
      const testPassword = 'mySecurePassword'
      useStore.setState({
        settings: {
          columns: 2,
          synchronize: true,
          identifier: 'test-id',
          password: testPassword
        }
      })

      // Create real encrypted data
      const originalData = {
        settings: {
          columns: 3,
          synchronize: true,
          identifier: 'test-id',
          password: testPassword // Keep password in decrypted data
        },
        modules: [
          [{ type: 'decrypted1', id: 'dec1' }],
          [{ type: 'decrypted2', id: 'dec2' }]
        ]
      }

      // Actually encrypt the data
      const encrypted = await encryptData(testPassword, originalData)

      // Mock API response with encrypted data
      const apiResponse = {
        data: encrypted,
        revision: '123456'
      }

      // Setup mocks
      axios.get.mockResolvedValueOnce({ data: apiResponse })

      // Execute
      await useStore.getState().load()

      // Verify store was updated with decrypted data
      const state = useStore.getState()
      expect(state.settings).toEqual(originalData.settings)
      expect(state.modules).toEqual(originalData.modules)
      expect(state.revision).toEqual(apiResponse.revision)
    })

    test('2) should reset everything if decryption fails', async () => {
      if (typeof window?.crypto?.getRandomValues !== 'function') {
        console.info("Skip test, since window.crypto.getRandomValues isn't available")
        return
      }

      // Setup: set password in settings
      const correctPassword = 'correctPassword'
      const wrongPassword = 'wrongPassword'

      // Spy on the reset method
      const resetSpy = jest.fn()
      const originalReset = useStore.getState().reset
      useStore.getState().reset = resetSpy

      useStore.setState({
        settings: {
          columns: 2,
          synchronize: true,
          identifier: 'test-id',
          password: wrongPassword // Setting wrong password
        },
        modules: [[{ type: 'existing', id: 'existing' }]]
      })

      // Create data encrypted with the CORRECT password
      const originalData = {
        settings: {
          columns: 3,
          synchronize: true,
          identifier: 'test-id',
          password: correctPassword
        },
        modules: [
          [{ type: 'secure1', id: 'secure1' }]
        ]
      }

      // Actually encrypt with CORRECT password
      const encrypted = await encryptData(correctPassword, originalData)

      // Mock API response with encrypted data (that cannot be decrypted with wrong password)
      const apiResponse = {
        data: encrypted,
        revision: '123456'
      }

      // Setup mocks
      axios.get.mockResolvedValueOnce({ data: apiResponse })

      // Execute
      await useStore.getState().load()

      // Verify reset was called since decryption should fail
      expect(resetSpy).toHaveBeenCalled()

      // Restore original reset method
      useStore.getState().reset = originalReset
    })
  })

  describe('storing with encryption', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks()

      // Initialize the store with default values
      useStore.setState({
        settings: {
          synchronize: true,
          identifier: 'test-id',
          columns: 1
        },
        modules: [[{ type: 'test', id: 'test-module' }]],
        theme: 'light',
        revision: null,
        synchronizedStateHasChanges: true
      })
    })

    test('3) Should encrypt data on PUT if password is set', async () => {
      if (typeof window?.crypto?.getRandomValues !== 'function') {
        console.info("Skip test, since window.crypto.getRandomValues isn't available")
        return
      }

      // Setup: no revision but set a password
      const testPassword = 'secure123'
      useStore.setState({
        revision: null,
        settings: {
          synchronize: true,
          identifier: 'test-id',
          columns: 1,
          password: testPassword
        }
      })

      // Mock successful PUT response
      axios.put.mockResolvedValueOnce({
        data: { revision: 'encrypted-put-123' }
      })

      // Execute
      await useStore.getState().persist()

      // Parse the data sent to verify it contains encrypted content
      const sentData = JSON.parse(axios.put.mock.calls[0][1])
      expect(sentData).toHaveProperty('encryptedData')
      expect(sentData.encryptedData).toHaveProperty('iv')
      expect(sentData.encryptedData).toHaveProperty('salt')
      expect(sentData.encryptedData).toHaveProperty('data')

      // Verify the encrypted data can be decrypted back
      const decrypted = await decryptData(testPassword, sentData.encryptedData)
      expect(decrypted).toBeTruthy()
      expect(decrypted).toHaveProperty('settings')
      expect(decrypted).toHaveProperty('modules')

      // Settings should match our store state (including the password)
      expect(decrypted.settings.password).toBe(testPassword)
    })

    test('3) Should encrypt data on POST if password is set', async () => {
      if (typeof window?.crypto?.getRandomValues !== 'function') {
        console.info("Skip test, since window.crypto.getRandomValues isn't available")
        return
      }

      // Setup: set a revision and password
      const testPassword = 'secure456'
      useStore.setState({
        revision: 'existing-revision-123',
        settings: {
          synchronize: true,
          identifier: 'test-id',
          columns: 1,
          password: testPassword
        }
      })

      // Mock successful POST response
      axios.post.mockResolvedValueOnce({
        data: { revision: 'encrypted-post-456' }
      })

      // Execute
      await useStore.getState().persist()

      // Assert: POST was called with URL including revision
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}test-id?revision=existing-revision-123`,
        expect.any(String),
        { headers: API_AUTH_HEADER }
      )

      // Parse the data sent to verify it contains encrypted content
      const sentData = JSON.parse(axios.post.mock.calls[0][1])
      expect(sentData).toHaveProperty('encryptedData')
      expect(sentData.encryptedData).toHaveProperty('iv')
      expect(sentData.encryptedData).toHaveProperty('salt')
      expect(sentData.encryptedData).toHaveProperty('data')

      // Verify the encrypted data can be decrypted back
      const decrypted = await decryptData(testPassword, sentData.encryptedData)
      expect(decrypted).toBeTruthy()
      expect(decrypted).toHaveProperty('settings')
      expect(decrypted).toHaveProperty('modules')

      // Settings should match our store state (including the password)
      expect(decrypted.settings.password).toBe(testPassword)
    })

    test('3) Make sure to not encrypt data if no password is set', async () => {
      // Setup: no revision and no password
      useStore.setState({
        revision: null,
        settings: {
          synchronize: true,
          identifier: 'test-id',
          columns: 1,
          password: null // explicitly set to null
        }
      })

      // Mock successful PUT response
      axios.put.mockResolvedValueOnce({
        data: { revision: 'unencrypted-123' }
      })

      // Execute
      await useStore.getState().persist()

      // Assert: PUT data should not contain encryptedData
      const sentData = JSON.parse(axios.put.mock.calls[0][1])
      expect(sentData).not.toHaveProperty('encryptedData')
      expect(sentData).toHaveProperty('settings')
      expect(sentData).toHaveProperty('modules')
    })
  })
})
