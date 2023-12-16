import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Workout } from './workout.entity';

@Entity({ name: 'summaries' })
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workout, (workout) => workout.summaries)
  workout: Workout;

  @OneToMany(() => Task, (task) => task.summary)
  tasks: Task[];

  @Column({ default: null, type: 'simple-json' })
  tasksCompleted: number[];

  @Column({ default: null, type: 'simple-json' })
  tasksDue: number[];

  @Column({ default: null, type: 'simple-json' })
  tasksPastDue: number[];

  @Column({ default: null })
  timespent: number;

  @Column()
  startedAt: Date;

  @Column({ default: null })
  finishedAt: Date;

  @Column({ default: null, type: 'simple-json' })
  currentUser: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
