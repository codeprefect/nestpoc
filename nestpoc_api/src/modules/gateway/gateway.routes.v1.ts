import { Routes } from 'nest-router';
import { AuthModule } from './auth/auth.module';

const routePrefix = '/api/v1';
export const routes: Routes = [
  {
    path: `${routePrefix}/auth`,
    module: AuthModule,
  },
];
