import React from "react";

interface Props {
  size: number;
  source: string;
  altText: string;
  padding?: number;
}

export const Avatar: React.FC<Props> = ({ size, source, altText, padding = 0 }) => {

  return (
    <div className='rounded-full shadow-lg p-1 mr-3 bg-slate-600 overflow-hidden'
    style={{ height: size, width: size, padding: `${padding}px` }}>
    <img src={source} alt={altText} className="object-cover"/>
  </div>
  )
}