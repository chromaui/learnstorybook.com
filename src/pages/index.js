import React from 'react';
import IndexScreen from '../components/screens/IndexScreen';
import PageHead from '../components/composite/PageHead';

function Index(props) {
  return <IndexScreen {...props} />;
}

export default Index;

export function Head() {
  return <PageHead />;
}
