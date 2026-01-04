'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  zIndex?: number;
};

export default function SearchFilterStickyWrapper({ children, zIndex = 100 }: Props) {
  const [isSticky, setIsSticky] = useState(false);
  const [height, setHeight] = useState(0);

  return (
    <div className="sticky top-0 z-100 w-full">
      <div className="m-auto w-full max-w-105 items-center">{children}</div>
    </div>
  );
}
