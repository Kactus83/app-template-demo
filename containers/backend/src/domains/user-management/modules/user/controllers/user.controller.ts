import {
  Controller,
  Get,
  Patch,
  Req,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { Express } from 'express';
import { AuthGuard } from '../../../../../core/guards/auth.guard';
import { IAuthenticatedRequest } from '../../../../../core/models/interfaces/authenticated-request.interface';
import { UserService } from '../services/user.service';
import { UserUpdateDto } from '../models/dto/user-update.dto';
import { UserDto } from '../../../../../core/models/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

/**
 * Contrôleur de gestion du profil utilisateur.
 *
 * Ce contrôleur gère la récupération et la mise à jour du profil de l'utilisateur,
 * incluant la mise à jour de l'avatar par téléchargement de fichier ou par URL.
 *
 * @category User Management - Controller
 */
@ApiTags('USER MANAGEMENT - User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Récupère le profil de l'utilisateur authentifié.
   *
   * @param req - Requête HTTP authentifiée contenant les informations de l'utilisateur.
   * @returns Le profil utilisateur.
   * @throws {HttpException} Si l'utilisateur n'est pas trouvé.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() req: IAuthenticatedRequest): Promise<UserDto> {
    const userId = req.user?.['id'];
    if (!userId) {
      throw new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.getCurrentUser(userId);
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * Met à jour le profil de l'utilisateur.
   *
   * Ce endpoint permet de mettre à jour le profil, y compris l'avatar
   * lorsque l'utilisateur fournit une URL déjà hébergée.
   *
   * @param req - Requête HTTP authentifiée.
   * @param userUpdateDto - Données de mise à jour du profil.
   * @returns Le profil utilisateur mis à jour.
   * @throws {HttpException} Si les données sont invalides ou l'utilisateur non trouvé.
   */
  @Patch()
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUser(
    @Req() req: IAuthenticatedRequest,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserDto> {
    const userId = req.user?.['id'];
    if (!userId) {
      throw new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED);
    }
    const updatedUser = await this.userService.updateUser(userId, userUpdateDto);
    if (!updatedUser) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  /**
   * Met à jour l'avatar de l'utilisateur via téléchargement de fichier.
   *
   * Ce endpoint permet à l'utilisateur d'uploader un fichier image qui sera
   * traité par le StorageService. L'URL générée sera ensuite enregistrée dans
   * le profil de l'utilisateur.
   *
   * @param file - Fichier image uploadé.
   * @param req - Requête HTTP authentifiée.
   * @returns Le profil utilisateur mis à jour avec le nouvel avatar.
   * @throws {HttpException} Si aucun fichier n'est fourni ou en cas d'erreur.
   */
  @Patch('/avatar')
  @ApiOperation({ summary: "Update user's avatar via file upload" })
  @ApiResponse({
    status: 200,
    description: 'User avatar updated successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './tmp/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new HttpException('Seuls les fichiers image sont autorisés', HttpStatus.BAD_REQUEST),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: IAuthenticatedRequest,
  ): Promise<UserDto> {
    if (!file) {
      throw new HttpException('Aucun fichier fourni', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user?.['id'];
    if (!userId) {
      throw new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED);
    }
    const destinationFileName = `avatars/${file.filename}`;
    const updatedUser = await this.userService.updateUserAvatar(userId, file.path, destinationFileName);
    if (!updatedUser) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }
}