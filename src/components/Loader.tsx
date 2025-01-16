import { LoaderProps } from '@/types';
import React from 'react';

export default function Loader({
  width,
  height,
  border,
  marginLeft,
  marginRight,
}: LoaderProps) {
    return (
        <div className="loader-container">
            <div
                style={{
                    width: width,
                    height: height,
                    border: `${border} solid transparent`,
                    borderTop: `${border} solid #007bff`,
                    marginLeft: marginLeft,
                    marginRight: marginRight,
                }}
                className="loader"
            ></div>
        </div>
    );
}
