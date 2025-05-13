import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserServiceAccountRepository } from '../repositories/user-service-account.repository';
import { JwtUtilityService } from '../../../../../core/services/jwt-utility.service';
import { IssueTokenDto } from '../models/dto/issue-token.dto';
import { JwtServiceAccountPayloadDto } from '../../../../../core/models/dto/jwt-service-account-payload.dto';

/**
 * Service d’authentification des Service Accounts
 * - Émission de JWT via grant client_credentials
 * @category Domains/Auth
 */
@Injectable()
export class ServiceAccountAuthService {
private static readonly TOKEN_TTL_SECONDS = 900; // 15 minutes

constructor(
    private readonly repo: UserServiceAccountRepository,
    private readonly jwtUtility: JwtUtilityService,
) {}

/**
 * Émet un JWT pour un compte de service via client_credentials.
 * @param dto Contient clientId & clientSecret transmis par le client
 * @param ipAddress Optionnel : IP source pour whitelisting
 */
async issueToken(
    dto: IssueTokenDto,
    ipAddress?: string,
): Promise<{
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    scope: string;
}> {
    const account = await this.repo.findByClientId(dto.clientId);
    const now = new Date();

    if (account.validFrom > now || (account.validTo && account.validTo < now)) {
    throw new ForbiddenException('Service account not valid at this time');
    }

    if (ipAddress && account.allowedIps.length) {
    const ok = account.allowedIps.some((cidr) =>
        ipAddress.startsWith(cidr.split('/')[0]),
    );
    if (!ok) {
        throw new ForbiddenException('IP address not allowed');
    }
    }

    const isValid = await bcrypt.compare(dto.clientSecret, account.clientSecret);
    if (!isValid) {
    throw new UnauthorizedException('Invalid client credentials');
    }

    const scopes = await this.repo.listScopes(account.id);
    const scopeArray = scopes.map(
    (s) => `${s.target.toLowerCase()}:${s.permission.toLowerCase()}`,
    );
    const scopeString = scopeArray.join(' ');

    const payload = plainToInstance(JwtServiceAccountPayloadDto, {
    clientId: account.clientId,
    userId: account.userId,
    scopes: scopeArray,
    });

    const token = this.jwtUtility.signServiceAccountToken(payload);

    return {
    access_token: token,
    token_type: 'Bearer',
    expires_in: ServiceAccountAuthService.TOKEN_TTL_SECONDS,
    scope: scopeString,
    };
}
}
