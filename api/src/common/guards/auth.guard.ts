import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {Request} from "express"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get token from request
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    // Verify token and extract user payload
    if (!token) {
      throw new UnauthorizedException("No token");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload; // assign user to request object to use later
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] =
      request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
