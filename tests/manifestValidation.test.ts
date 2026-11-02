import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
// @ts-ignore
import Ajv from '/home/adminis/.npm-global/lib/node_modules/@forge/cli/node_modules/ajv';

test('Manifest Validation against official Atlassian Forge Schema', () => {
  const schemaPath = '/home/adminis/.npm-global/lib/node_modules/@forge/cli/node_modules/@forge/manifest/out/schema/manifest-schema.json';
  assert.ok(fs.existsSync(schemaPath), 'Atlassian Forge manifest schema must exist');

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const ajv = new Ajv({ strict: false });
  const validate = ajv.compile(schema);

  const manifestPath = path.resolve('manifest.yml');
  assert.ok(fs.existsSync(manifestPath), 'manifest.yml must exist');

  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifestData = yaml.load(manifestContent);

  const isValid = validate(manifestData);
  if (!isValid) {
    console.error('Manifest validation errors:', validate.errors);
  }
  assert.strictEqual(isValid, true, 'manifest.yml must strictly conform to official Atlassian Forge schema');

  // Verify specific required modules
  const modules = (manifestData as any).modules;
  assert.ok(modules['rovo:agent'], 'Must contain rovo:agent module');
  assert.ok(modules['rovo:mcp'], 'Must contain rovo:mcp module');
  assert.ok(modules['action'], 'Must contain action extensions');
  assert.ok(modules['jira:issuePanel'], 'Must contain jira:issuePanel');
  assert.ok(modules['webtrigger'], 'Must contain webtrigger');
  assert.ok(modules['function'], 'Must contain functions');
});
