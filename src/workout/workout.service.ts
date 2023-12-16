import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { User } from 'src/entities/user.entity';
import { Workout } from 'src/entities/workout.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    private readonly mailerService: MailerService,
  ) {}

  public async inviteUsers(
    id: number,
    invitedEmails: { emails: string },
  ): Promise<void> {
    const workout = await this.workoutRepository.findOneBy({ id });
    if (!workout) {
      throw new NotFoundException(returnMessages.WorkoutNotFound);
    }
    const arrOfEmails = invitedEmails.emails.split(',');
    arrOfEmails.forEach(async (email) => {
      const token = [0, 0, 0, 0].reduce((acc) => {
        return acc + Math.floor(Math.random() * 10);
      }, '');
      const link =
        process.env.BASE_URL +
        process.env.APP_PORT +
        `/users/worksouts/${id}/invite?token=${token}&email=${email}`;
      await this.userTokenRepository.save({
        userEmail: email,
        workout,
        token,
      });
      this.mailerService
        .sendMail({
          to: email,
          from: process.env.MAILER_USER,
          subject: 'You got invitation to join workout',
          template: 'invitation-email',
          context: { link, name: 'test' },
        })
        .then((info) => {
          console.log(info);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  public async verifyInvite(id: number, email: string, token: string) {
    const userToken = await this.userTokenRepository.findOne({
      where: { token, userEmail: email, workout: { id } },
    });
    if (!userToken) {
      throw new UnauthorizedException();
    }
  }

  public async checkDoesEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      return true;
    }
    return false;
  }
}
