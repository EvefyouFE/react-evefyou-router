import React from 'react';

export function defaultWrapComponent(
  component: React.ComponentType<any>,
) {
  if (!component) return null;
  return component;
}

