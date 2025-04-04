import Image from 'next/image';
import { useState } from 'react';

interface TeamLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export function TeamLogo({ src, alt, className = '' }: TeamLogoProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (error) {
    return null;
  }

  return (
    <div className={`relative ${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className={`object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        unoptimized // Desabilita a otimização do Next.js para imagens externas
        priority={false}
      />
    </div>
  );
} 