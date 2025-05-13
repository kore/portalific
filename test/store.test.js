import { useTestStore as useStore } from '../utils/store';
import axios from 'axios';

jest.mock('axios');

const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => {
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

let window = {}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Zustand Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    
    // Reset the store to initial state between tests
    const { getState, setState } = useStore;
    setState({
      settings: { columns: 1 },
      theme: 'auto',
      modules: [[{ type: 'welcome', id: 'welcome' }]],
      errors: [],
      revision: null,
    });
  });

  describe('setSettings function', () => {
    test('should update settings', () => {
      const newSettings = { columns: 2 };
      
      useStore.getState().setSettings(newSettings);
      
      expect(useStore.getState().settings).toEqual(newSettings);
    });

    test('should maintain module structure when columns increase', () => {
      const initialModules = [[{ type: 'welcome', id: 'welcome' }]];
      useStore.setState({
        settings: { columns: 1 },
        modules: initialModules
      });
      
      useStore.getState().setSettings({ columns: 3 });
      
      expect(useStore.getState().modules[0]).toEqual(initialModules[0]);
      expect(useStore.getState().modules.length).toBeGreaterThanOrEqual(1);
    });

    test('should redistribute modules when columns decrease', () => {
      const modulesInThreeColumns = [
        [{ type: 'module1', id: 'mod1' }],
        [{ type: 'module2', id: 'mod2' }],
        [{ type: 'module3', id: 'mod3' }]
      ];
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesInThreeColumns
      });
      
      useStore.getState().setSettings({ columns: 2 });
      
      expect(useStore.getState().modules.length).toBeGreaterThanOrEqual(2);
      expect(useStore.getState().modules[0]).toEqual([{ type: 'module1', id: 'mod1' }]);
      expect(useStore.getState().modules[1]).toEqual([{ type: 'module2', id: 'mod2' }, { type: 'module3', id: 'mod3' }]);
      expect(useStore.getState().modules[2]).toEqual([]);
    });

    test('should merge all modules into first column when reducing to single column', () => {
      const modulesInThreeColumns = [
        [{ type: 'module1', id: 'mod1' }],
        [{ type: 'module2', id: 'mod2' }],
        [{ type: 'module3', id: 'mod3' }]
      ];
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesInThreeColumns
      });
      
      useStore.getState().setSettings({ columns: 1 });
      
      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module2', id: 'mod2' },
        { type: 'module3', id: 'mod3' }
      ]);
      expect(useStore.getState().modules[1]).toEqual([]);
      expect(useStore.getState().modules[2]).toEqual([]);
    });

    test('should handle null modules when reducing columns', () => {
      const modulesWithNull = [
        [{ type: 'module1', id: 'mod1' }],
        null,
        [{ type: 'module3', id: 'mod3' }]
      ];
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesWithNull
      });
      
      useStore.getState().setSettings({ columns: 1 });
      
      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module3', id: 'mod3' }
      ]);
    });

    test('should filter out falsy modules during column reduction', () => {
      const modulesWithUndefined = [
        [{ type: 'module1', id: 'mod1' }],
        [undefined, { type: 'module2', id: 'mod2' }],
        [{ type: 'module3', id: 'mod3' }, null]
      ];
      useStore.setState({
        settings: { columns: 3 },
        modules: modulesWithUndefined
      });
      
      useStore.getState().setSettings({ columns: 1 });
      
      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module2', id: 'mod2' },
        { type: 'module3', id: 'mod3' }
      ]);
    });
  });

  describe('moveModule function', () => {
    test('should move module within the same column', () => {
      const initialModules = [
        [
          { type: 'module1', id: 'mod1' },
          { type: 'module2', id: 'mod2' },
          { type: 'module3', id: 'mod3' }
        ]
      ];
      useStore.setState({
        modules: initialModules
      });
      
      useStore.getState().moveModule(0, 0, 0, 2);
      
      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module2', id: 'mod2' },
        { type: 'module3', id: 'mod3' },
        { type: 'module1', id: 'mod1' }
      ]);
    });

    test('should move module to a different column', () => {
      const initialModules = [
        [{ type: 'module1', id: 'mod1' }],
        [{ type: 'module2', id: 'mod2' }]
      ];
      useStore.setState({
        settings: { columns: 2 },
        modules: initialModules
      });
      
      useStore.getState().moveModule(0, 0, 1, 0);
      
      expect(useStore.getState().modules[0]).toEqual([]);
      expect(useStore.getState().modules[1]).toEqual([
        { type: 'module1', id: 'mod1' },
        { type: 'module2', id: 'mod2' }
      ]);
    });

    test('should create target column array if it does not exist', () => {
      const initialModules = [
        [{ type: 'module1', id: 'mod1' }]
      ];
      useStore.setState({
        settings: { columns: 2 },
        modules: initialModules
      });
      
      useStore.getState().moveModule(0, 0, 1, 0);
      
      expect(useStore.getState().modules[0]).toEqual([]);
      expect(useStore.getState().modules[1]).toEqual([
        { type: 'module1', id: 'mod1' }
      ]);
    });

    test('should handle moving to a higher index in the same column', () => {
      const initialModules = [
        [
          { type: 'module1', id: 'mod1' },
          { type: 'module2', id: 'mod2' },
          { type: 'module3', id: 'mod3' }
        ]
      ];
      useStore.setState({
        modules: initialModules
      });
      
      useStore.getState().moveModule(0, 0, 0, 1);
      
      expect(useStore.getState().modules[0]).toEqual([
        { type: 'module2', id: 'mod2' },
        { type: 'module1', id: 'mod1' },
        { type: 'module3', id: 'mod3' }
      ]);
    });
  });

  describe('load function', () => {
    const API_URL = 'https://local-storage-storage.io/api/portalific/';
    const mockResponseData = {
      data: JSON.stringify({
        settings: { columns: 3, synchronize: true, identifier: 'test-id' },
        modules: [
          [{ type: 'remote1', id: 'remote1' }],
          [{ type: 'remote2', id: 'remote2' }],
        ],
        theme: 'dark'
      }),
      revision: '123456'
    };

    beforeEach(() => {
      axios.get.mockClear();
    });

    test('should not fetch data if synchronize is false', async () => {
      useStore.setState({
        settings: { columns: 2, synchronize: false }
      });
      
      await useStore.getState().load();
      
      expect(axios.get).not.toHaveBeenCalled();
    });

    test('should fetch and update store with remote data when synchronize is true', async () => {
      useStore.setState({
        settings: { columns: 2, synchronize: true, identifier: 'test-id' }
      });
      
      axios.get.mockResolvedValueOnce({ data: mockResponseData });
      
      await useStore.getState().load();
      
      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}test-id`,
        { headers: { Authorization: 'Bearer dslafki92esakflu8qfasdf' } }
      );
      
      const state = useStore.getState();
      const parsedResponse = JSON.parse(mockResponseData.data);
      
      expect(state.settings).toEqual(parsedResponse.settings);
      expect(state.modules).toEqual(parsedResponse.modules);
      expect(state.theme).toEqual(parsedResponse.theme);
      expect(state.revision).toEqual(mockResponseData.revision);
    });

    test('should handle API response correctly', async () => {
      useStore.setState({
        settings: { columns: 1, synchronize: true, identifier: 'test-id' },
        modules: [[{ type: 'local', id: 'local' }]],
        theme: 'auto'
      });
      
      const customResponse = {
        data: JSON.stringify({
          settings: { columns: 2, synchronize: true, identifier: 'test-id' },
          modules: [
            [{ type: 'api1', id: 'api1' }],
            [{ type: 'api2', id: 'api2' }]
          ],
          theme: 'light'
        }),
        revision: 'abc123'
      };
      
      axios.get.mockResolvedValueOnce({ data: customResponse });
      
      await useStore.getState().load();
      
      const state = useStore.getState();
      const parsedResponse = JSON.parse(customResponse.data);
      
      expect(state.settings).toEqual(parsedResponse.settings);
      expect(state.modules).toEqual(parsedResponse.modules);
      expect(state.theme).toEqual(parsedResponse.theme);
      expect(state.revision).toEqual(customResponse.revision);
    });
  });
});
