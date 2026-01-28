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
In diesen 5 Tagen habe ich einiges gelernt. Die Grundstruktur für eine API in NestJs. Wie der Controller, Service, etc. aussehen muss. Meiner meinung nach war dies einer der Besten ÜKs, welche ich je hatte. Weil ich fühle mich als ob ich selbständig, natürlich hier und da mit Hilfe, eine eigene REST-API in Nestjs erstellen könnte. Bei den Projekten habe ich alles eigentlich gut verstanden. Die Security fällt mir ab und zu mit dem Token noch ein wenig schwer, aber ich denke, dass ich dies auch bald im Geschäftsbereich vertieft anschaue und es hat mir schon einmal einen guten Einblick gegeben. Auch wenn es nicht meine eigentlich Hauptsprache (Java) ist, denke ich, es bringt mir auch viel für das Geschäft, weil es allgemeines aufgezeigt hat. Sicherlich wird es mir auch neben meinem momentanen Geschäftsgeber etwas bringen. Ich glaube, dass wir Nestjs sogar in ein paar fällen verwenden.
Alles in allem würde ich sagen es hat einen sehr guten und ausführlichen Einblick in die REST-API Backend entwicklung gegeben.

License
Nest is MIT licensed.
