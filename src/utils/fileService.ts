import fs from 'fs/promises';
import path from 'path';
import { Logger } from './logger';
import { TestCase } from '../models/types';

const logger = new Logger('FileService');

export class FileService {
  async exportJSON(filePath: string, data: unknown): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      logger.info(`File exported: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to export file: ${filePath}`, error);
      throw error;
    }
  }

  async readJSON<T>(filePath: string): Promise<T> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error);
      throw error;
    }
  }

  async exportTestCases(testCases: TestCase[], filePath: string): Promise<void> {
    await this.exportJSON(filePath, {
      totalTestCases: testCases.length,
      generatedAt: new Date().toISOString(),
      testCases,
    });
  }

  async exportPlaywrightScript(script: string, filePath: string): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, script, 'utf-8');
      logger.info(`Playwright script exported: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to export Playwright script: ${filePath}`, error);
      throw error;
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
