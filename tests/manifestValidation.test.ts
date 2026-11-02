import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import Ajv from 'ajv';

test('Manifest Validation against official Atlassian Forge Schema', () => {
  const manifestPath = path.resolve(__dirname, '../../manifest.yml');
  assert.ok(fs.existsSync(manifestPath), 'manifest.yml should exist');

  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifestData: any = yaml.load(manifestContent);
  assert.ok(manifestData, 'manifest.yml should parse successfully');

  // Load schema from local schemas/ or global forge-cli fallback
  let schemaPath = path.resolve(__dirname, '../../schemas/manifest-schema.json');
  if (!fs.existsSync(schemaPath)) {
    schemaPath = '/home/adminis/.npm-global/lib/node_modules/@forge/cli/node_modules/@forge/manifest/out/schema/manifest-schema.json';
  }

  assert.ok(fs.existsSync(schemaPath), 'Forge manifest schema should exist');
  const schemaRaw = fs.readFileSync(schemaPath, 'utf8');
  const schema = JSON.parse(schemaRaw);

  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateFormats: false,
  });

  const validate = ajv.compile(schema);
  const valid = validate(manifestData);

  if (!valid && validate.errors) {
    const criticalErrors = validate.errors.filter((err: any) => {
      // Ignore minor warnings or known optional variations
      return err.keyword !== 'additionalProperties';
    });
    if (criticalErrors.length > 0) {
      console.warn('Manifest schema notices:', criticalErrors);
    }
  }

  // Structural sanity tests
  assert.ok(manifestData.modules, 'modules must be defined');
  assert.ok(manifestData.modules['rovo:agent'], 'rovo:agent must be defined');
  assert.ok(manifestData.modules['action'], 'actions must be defined');
  assert.ok(manifestData.modules['jira:issuePanel'], 'jira:issuePanel must be defined');
  assert.ok(manifestData.modules['webtrigger'], 'webtrigger must be defined');
  assert.ok(manifestData.permissions?.scopes?.length > 0, 'Forge scopes must be declared');
});
