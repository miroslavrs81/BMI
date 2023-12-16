import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workout } from './workout.entity';

@Entity({ name: 'users-token' })
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @ManyToOne(() => Workout, (workout) => workout.userTokens)
  workout: Workout;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;
}
