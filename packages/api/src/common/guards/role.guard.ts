import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles list from metadata of decorator Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles, then allow to pass by
    if (!requiredRoles) {
      return true;
    }

    // Get user from request context that was added at jwt check step
    const { user } = context.switchToHttp().getRequest();

    // Check if user has at least one of required roles
    const isAllowed = requiredRoles.some((role) => user.role?.includes(role));
    if (!isAllowed) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
