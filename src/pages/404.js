import React from 'react';
import NotFoundScreen from '../components/screens/NotFoundScreen/NotFoundScreen';
import PageHead from '../components/composite/PageHead';

function NotFoundPage() {
  return <NotFoundScreen />;
}

export default NotFoundPage;

export function Head() {
  return <PageHead />;
}
