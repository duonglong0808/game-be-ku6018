import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permission';
export const Permission = (permission: string | string[]) => SetMetadata(PERMISSIONS_KEY, permission);
