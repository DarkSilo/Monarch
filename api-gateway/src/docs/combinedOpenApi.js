'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadYaml(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.load(raw) || {};
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function prefixPath(prefix, routePath) {
  if (routePath === '/') {
    return prefix;
  }
  if (!routePath.startsWith('/')) {
    return `${prefix}/${routePath}`;
  }
  return `${prefix}${routePath}`;
}

function mergeTags(targetDoc, sourceDoc) {
  const targetTags = targetDoc.tags || [];
  const seen = new Set(targetTags.map((t) => t.name));
  for (const tag of sourceDoc.tags || []) {
    if (!seen.has(tag.name)) {
      targetTags.push(tag);
      seen.add(tag.name);
    }
  }
  targetDoc.tags = targetTags;
}

function mergeComponents(targetDoc, sourceDoc) {
  if (!sourceDoc.components) {
    return;
  }

  targetDoc.components = targetDoc.components || {};

  for (const [sectionName, sectionValue] of Object.entries(sourceDoc.components)) {
    targetDoc.components[sectionName] = targetDoc.components[sectionName] || {};

    for (const [key, value] of Object.entries(sectionValue || {})) {
      if (!(key in targetDoc.components[sectionName])) {
        targetDoc.components[sectionName][key] = value;
        continue;
      }

      const existing = JSON.stringify(targetDoc.components[sectionName][key]);
      const incoming = JSON.stringify(value);
      if (existing !== incoming) {
        // Keep the existing key to avoid breaking refs; conflicting definitions are ignored.
        // Current service specs share compatible keys (e.g., bearerAuth).
      }
    }
  }
}

function mergePrefixedPaths(targetDoc, sourceDoc, prefix) {
  targetDoc.paths = targetDoc.paths || {};
  const sourcePaths = sourceDoc.paths || {};

  for (const [routePath, routeDef] of Object.entries(sourcePaths)) {
    const prefixed = prefixPath(prefix, routePath);
    targetDoc.paths[prefixed] = deepClone(routeDef);
  }
}

function buildCombinedOpenApi() {
  const basePath = path.resolve(__dirname, '..', '..', 'api-docs', 'openapi.yaml');
  const authPath = path.resolve(__dirname, '..', '..', '..', 'authentication', 'api-docs', 'openapi.yaml');
  const inventoryPath = path.resolve(__dirname, '..', '..', '..', 'inventory', 'api-docs', 'openapi.yaml');
  const orderPath = path.resolve(__dirname, '..', '..', '..', 'Order-service', 'Order-service', 'api-docs', 'openapi.yaml');
  const notificationPath = path.resolve(__dirname, '..', '..', '..', 'notification-service', 'api-docs', 'openapi.yaml');

  const baseDoc = loadYaml(basePath);
  const authDoc = loadYaml(authPath);
  const inventoryDoc = loadYaml(inventoryPath);
  const orderDoc = loadYaml(orderPath);
  const notificationDoc = loadYaml(notificationPath);

  mergeTags(baseDoc, authDoc);
  mergeTags(baseDoc, inventoryDoc);
  mergeTags(baseDoc, orderDoc);
  mergeTags(baseDoc, notificationDoc);

  mergeComponents(baseDoc, authDoc);
  mergeComponents(baseDoc, inventoryDoc);
  mergeComponents(baseDoc, orderDoc);
  mergeComponents(baseDoc, notificationDoc);

  mergePrefixedPaths(baseDoc, authDoc, '/auth');
  mergePrefixedPaths(baseDoc, inventoryDoc, '/inventory');
  mergePrefixedPaths(baseDoc, orderDoc, '/orders');
  mergePrefixedPaths(baseDoc, notificationDoc, '/notifications');

  return baseDoc;
}

module.exports = {
  buildCombinedOpenApi,
};
