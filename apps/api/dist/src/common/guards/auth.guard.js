"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt = __importStar(require("jsonwebtoken"));
let AuthGuard = AuthGuard_1 = class AuthGuard {
    configService;
    logger = new common_1.Logger(AuthGuard_1.name);
    jwtSecret;
    constructor(configService) {
        this.configService = configService;
        this.jwtSecret = this.configService.get('JWT_SECRET') || '';
        if (!this.jwtSecret) {
            this.logger.error('JWT_SECRET is not defined in environment variables');
            throw new Error('JWT_SECRET configuration missing');
        }
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.warn('Initial Request rejected: No bearer token found');
            throw new common_1.UnauthorizedException('Authentication token missing');
        }
        try {
            let payload;
            try {
                payload = jwt.verify(token, this.jwtSecret);
            }
            catch (err) {
                if (err.message === 'invalid signature') {
                    const bufferSecret = Buffer.from(this.jwtSecret, 'base64');
                    try {
                        payload = jwt.verify(token, bufferSecret);
                        this.logger.debug('Token verified using Base64 decoded secret');
                    }
                    catch (innerErr) {
                        throw innerErr;
                    }
                }
                else {
                    throw err;
                }
            }
            request.user = {
                userId: payload.sub,
                email: payload.email,
                role: payload.role || 'authenticated',
                tenantId: payload.app_metadata?.tenant_id ||
                    payload.user_metadata?.tenant_id ||
                    '',
                organizationId: payload.app_metadata?.organization_id ||
                    payload.user_metadata?.organization_id ||
                    '',
            };
            return true;
        }
        catch (error) {
            this.logger.warn(`Token validation failed: ${error.message}`);
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = AuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map