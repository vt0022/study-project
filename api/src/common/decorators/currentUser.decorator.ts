import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;

    if (!user) {
      throw new UnauthorizedException('Please log in');
    }

    // Data means field of user, we can choose to return a field or whole user object
    return data ? user[data] : user;
  },
);
