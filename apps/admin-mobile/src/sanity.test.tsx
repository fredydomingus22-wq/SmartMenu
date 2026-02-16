import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

describe('Admin Mobile Sanity', () => {
  it('renders correctly', () => {
    const tree = render(
      <View>
        <Text>Admin App</Text>
      </View>
    ).toJSON();
    
    // Verify that the tree contains the expected text
    const stringified = JSON.stringify(tree);
    expect(stringified).toContain('Admin App');
  });
});
