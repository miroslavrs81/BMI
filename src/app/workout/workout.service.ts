import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkout } from 'src/entities/user-workout.entity';
import { User } from 'src/entities/user.entity';
import { Workout } from 'src/entities/workout.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { VerifyTokenDto } from './dto/verify-token.dto';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(UserWorkout)
    private readonly userWorkoutRepository: Repository<UserWorkout>,
    @InjectQueue('workout') private readonly mailerQueue: Queue,
  ) {}

  public async inviteUsers(
    workoutId: number,
    invitedEmails: { emails: string },
    user: User,
  ): Promise<void> {
    const workout = await this.workoutRepository.findOne({
      where: { id: workoutId },
      relations: { owner: true },
    });
    if (!workout) {
      throw new NotFoundException(returnMessages.WorkoutNotFound);
    }
    if (workout.owner.id !== user.id) {
      throw new UnauthorizedException(returnMessages.WorkoutOwnerInvite);
    }
    const arrOfEmails = invitedEmails.emails.split(',');

    arrOfEmails.forEach(async (email) => {
      this.userTokenRepository.update(
        { userEmail: email, workout: { id: workout.id }, isValid: true },
        { isValid: false },
      );
      const token = uuidv4();
      const link =
        process.env.BASE_URL +
        process.env.APP_PORT +
        `/app/workouts/verify?workspaceId=${workoutId}&token=${token}&email=${email}`;

      this.userTokenRepository.save({
        userEmail: email,
        workout: { id: workout.id },
        token,
      });

      await this.mailerQueue.add(
        'inviteEmail',
        {
          email,
          link,
          name: user.name,
          workspaceName: workout.workoutName,
        },
        {
          attempts: 5,
        },
      );
    });
  }

  public async verifyInvitation(
    verifyTokenDto: VerifyTokenDto,
    user: User,
  ): Promise<{ message: string; workout: Workout }> {
    const workout = await this.workoutRepository.findOneBy({
      id: verifyTokenDto.workoutId,
    });
    if (!workout) {
      throw new BadRequestException(returnMessages.WorkoutNotFound);
    }

    const userToken = await this.userTokenRepository.findOne({
      where: {
        token: verifyTokenDto.token,
        userEmail: verifyTokenDto.email,
        workout: { id: verifyTokenDto.workoutId },
      },
    });
    if (!userToken || userToken.userEmail !== user.email) {
      throw new BadRequestException(returnMessages.TokenNotValid);
    }

    this.userTokenRepository.update(userToken.id, { isValid: false });
    await this.userWorkoutRepository.save({
      workspace: { id: verifyTokenDto.workoutId },
      user,
    });

    return {
      message: returnMessages.TokenIsValid,
      workout,
    };
  }

  public async checkDoesEmailExists(
    email: string,
  ): Promise<{ userExists: boolean }> {
    const user = await this.userRepository.findOneBy({ email });
    return { userExists: user ? true : false };
  }
}
