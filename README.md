<p align="center"> <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a> </p>

Author: Rafael Keller

Project: ÜK M295 - Todo Backend mit NestJS & TypeORM

Zeitplan & Meilensteine (Projektfortschritt)
Dieser Zeitplan dient als Leitfaden für die Umsetzung der Bewertungskriterien.

Teil 1: Initialisierung & Grundstruktur (2h)
[x] Git Repository erstellen & .gitignore (für node_modules, dist, .env)

[x] NestJS Projekt-Bootstrap mit GlobalPrefix und Logger.

[x] CRUD-Gerüst für TODO, User und Auth mittels CLI generieren.

[x] 1. Commit: Grobe Projektstruktur und CLI-Generierung.

Teil 2: Datenmodellierung & Validierung (1h)
[x] Todo-Entity: Implementierung aller Felder (ID, Title, Description, isClosed, Timestamps, Version).

[x] DTOs: Create, Return, Update DTOs inkl. class-validator Regeln (Length, Type-Checks).

[x] Environment: .env Konfiguration für Port, DB-Pfad und JWT-Secret via ConfigService.

[x] 2. Commit: Datenmodell und Validierungslogik abgeschlossen.

Teil 3: Security, Business Logic & Seeding (2h)
[x] Authentication: JWT-Strategie, Passport-Integration und Passwort-Hashing mit bcrypt.

[x] Todo-Service: CRUD-Logik inkl. Verknüpfung der createdById und updatedById.

[x] Seeding: Initialer Datenbank-Seed mit 4 Todo-Einträgen in data/todo.db.

[x] 3. Commit: Voll funktionsfähige Logik und Absicherung der Endpunkte.

Teil 4: Dokumentation, Testing & Abgabe (1h + Puffer)
[x] OpenAPI (Swagger): Vollständige API-Doku mit ApiProperty, example und addBearerAuth.

[X] Unit-Tests: 100% Code-Coverage für todo.service.spec (Mocking der Repositories).

[X] E2E / Postman: Finale Prüfung aller Endpunkte (Zertifizierung der 96 Postman-Punkte).

[X] Fazit: Reflexion und Abschlussdokumentation.

[X] Finaler Commit: Abgabebereiter Stand.

Technische Details
Installation
Bash
$ npm install
Umgebungsvariablen (.env)
Erstelle eine .env Datei im Root-Verzeichnis:

Code-Snippet
PORT=3000
JWT_SECRET=dein_super_geheimes_secret
DB_DATABASE=data/todo.db
API-Dokumentation
Die Swagger-Dokumentation ist nach dem Start unter folgendem Pfad erreichbar: http://localhost:3000/docs

Tests ausführen
Bash
# Unit Tests (Ziel: 100% Coverage)
$ npm run test

# Test Coverage
$ npm run test:cov



Fazit
Zuerst war ich sehr gut im Zeitplan, dann habe ich das mit den Modulen nicht gemacht. Dadurch habe ich zuerst viel Zeit verloren, aber ich konnte die Zeit wieder gut Aufholen. Am Schluss bin ich so einigermassen zufrieden, ich habe zwar nicht alle Tests richtig und auch nicht 100\% Coverage. Aber ich habe die anderen Sachen gut durchführen können. Alles ist eigentlich sehr gut verlaufen, bis auf die Tests. Was sicher mein grösster Fehler war, war es nicht richtig mit den Modulen zu arbeiten, aber ich konnte dennoch es meiner Meinung nach gut abgeben. 

Projekt Details:
Ich habe für das 1. Ziel ein wenig länger gebraucht. Eher gegen die 2h
Für das 2. Ziel habe ich deutlich kürzer gebraucht eher 0.5h
Für das 3. Ziel habe ich genau nach vorgabe dran gehabt also etwa 2h
Für das 4. Ziel habe ich noch länger gebraucht also 2.5h

License
Nest is MIT licensed.
