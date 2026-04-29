import {
  exportCategories,
  exportGroupCategories,
  validateCategoryImport,
  importCategories
} from './groupTabCategoryExporter.js';
import { setCategory, clearCategories, getAllCategories, getCategoriesForGroup } from './groupTabCategorizer.js';

jest.mock('./groupTabCategorizer.js');

describe('groupTabCategoryExporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportCategories', () => {
    it('exports all categories with metadata', () => {
      getAllCategories.mockReturnValue({ 'g1::t1': 'work', 'g2::t2': 'research' });
      const result = exportCategories();
      expect(result.version).toBe(1);
      expect(result.exportedAt).toBeLessThanOrEqual(Date.now());
      expect(result.categories).toEqual({ 'g1::t1': 'work', 'g2::t2': 'research' });
    });
  });

  describe('exportGroupCategories', () => {
    it('exports categories for a specific group', () => {
      getCategoriesForGroup.mockReturnValue({ 'g1::t1': 'work' });
      const result = exportGroupCategories('g1');
      expect(result.groupId).toBe('g1');
      expect(result.categories).toEqual({ 'g1::t1': 'work' });
    });
  });

  describe('validateCategoryImport', () => {
    it('returns valid for correct payload', () => {
      const { valid, errors } = validateCategoryImport({ version: 1, categories: {} });
      expect(valid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('returns invalid for non-object input', () => {
      const { valid, errors } = validateCategoryImport(null);
      expect(valid).toBe(false);
      expect(errors[0]).toMatch(/object/);
    });

    it('returns invalid for wrong version', () => {
      const { valid, errors } = validateCategoryImport({ version: 99, categories: {} });
      expect(valid).toBe(false);
      expect(errors[0]).toMatch(/version/);
    });

    it('returns invalid when categories field is missing', () => {
      const { valid, errors } = validateCategoryImport({ version: 1 });
      expect(valid).toBe(false);
      expect(errors[0]).toMatch(/categories/);
    });
  });

  describe('importCategories', () => {
    it('calls setCategory for each valid entry', () => {
      const mockSet = jest.fn();
      const data = { version: 1, categories: { 'g1::t1': 'work', 'g2::t3': 'personal' } };
      const { imported, errors } = importCategories(data, mockSet);
      expect(imported).toBe(2);
      expect(errors).toHaveLength(0);
      expect(mockSet).toHaveBeenCalledWith('g1', 't1', 'work');
      expect(mockSet).toHaveBeenCalledWith('g2', 't3', 'personal');
    });

    it('records errors for malformed keys', () => {
      const mockSet = jest.fn();
      const data = { version: 1, categories: { 'badkey': 'work' } };
      const { imported, errors } = importCategories(data, mockSet);
      expect(imported).toBe(0);
      expect(errors[0]).toMatch(/badkey/);
    });

    it('returns errors for invalid payload', () => {
      const mockSet = jest.fn();
      const { imported, errors } = importCategories(null, mockSet);
      expect(imported).toBe(0);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
