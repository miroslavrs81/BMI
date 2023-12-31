import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Summary } from './summary.entity';
import { User } from './user.entity';
import { Workout } from './workout.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => Workout, (workout) => workout.tasks)
  workout: Workout;

  @ManyToOne(() => Summary, (summary) => summary.tasks)
  summary: Summary[];

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  priority: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ nullable: true })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
