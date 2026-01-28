import { Module } from '@nestjs/common';
import { TodoItemsModule } from './todo-items/todo-items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // wichtig, damit überall verfügbar
    }),
    // datenbank initialisieren. Wir verwenden sqlite
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      synchronize: true, // !! Wichtig: Nur für Entwicklungszwecke aktivieren, in Produktion wird das nicht empfohlen. Hier sollte man mit Migrations arbeiten
      type: 'sqlite',
      database: process.env.DB_NAME || 'todo/myApp.db',
    }),
    AuthModule,
    TodoItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
