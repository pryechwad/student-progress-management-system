import type { ReactNode } from 'react';

// Container layout
const Container = ({ children }: { children: ReactNode }) => {
  return <div className="w-full px-1 sm:px-4 md:max-w-4xl md:mx-auto overflow-x-auto">{children}</div>;
};

export default Container;