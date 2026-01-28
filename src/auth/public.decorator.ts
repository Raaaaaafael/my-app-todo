import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'; // Konstante nutzen für Sicherheit
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
