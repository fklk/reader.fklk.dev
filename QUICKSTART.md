# Quickstart

## Vorbereitungen

1. <kbd>https://github.com/fklk/reader.fklk.dev</kbd> klonen
2. <kbd>npm install</kbd> im entsprechenden Directory
3. Erstellen einer <kbd>.env</kbd> Datei im Root-Directory

## Datenbankverbindung ermöglichen

Getestet wurde ausschließlich mit PostgreSQL. Außerdem ist Prisma aktuell auf PostgreSQL konfiguriert. Wird ein anderes DBMS verwendet, muss <kbd>schema.prisma</kbd> angepasst werden ([prisma.io Dokumentation](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql)).

`.env`

```
DATABASE_URL=<DATABASE_URL>
```

Bsp.: <kbd>DATABASE_URL="postgresql://user:password@localhost:5432/readr"</kbd>

### Prisma Schema auf Datenbank anwenden

Die Datenbank muss manuell erstellt werden. Die Tabellen werden durch Prisma erstellt.

```bash
npx prisma db push
```

### Die Datenbank mit Beispieldaten füllen

```bash
npx prisma db seed
```

Das Passwort der erstellten Nutzer ist <kbd>hJoTZZ96K6j9&Ez3ABdA2SWF54\*nchhT</kbd> \
*Erstellte Benutzer: {<kbd>valery</kbd>, <kbd>donald</kbd>, <kbd>ernest</kbd>, <kbd>admin</kbd>}*

### Datenbank verwalten

Es ist zu empfehlen, die Datenbank in dem sog. Prisma-Studio zu verwalten und nicht über bspw. pgAdmin die Daten zu manipulieren.

```bash
npx prisma db studio
```

Das Prisma-Stdio ist unter <kbd>http://localhost:5555</kbd> zu erreichen und startet automatisch den Browser.

## Anwendung starten

Für eine angenehmere Nutzererfahrung ist zu empfehlen, erst `npm run build` und anschließend `npm start` durchzuführen.

Alternativ - oder sollte es bei empfohlener Vorgehensweise zu Fehlern führen - kann auf `npm run dev` zurückgegriffen werden. Hier werden die einzelnen Seiten aber teils zur Laufzeit gerendert, weshalb es beim erstmaligen Aufrufen von neuen Seiten zu Verzögerungen kommen kann. Außerdem kam es ab und zu vor, dass der Dev-Server nicht korrekt funktioniert hat. Nach einem Neustart des Dev-Servers ging es dann aber wieder.

### Hinweis

Bei der Entwicklung der Applikation wurde nicht explizit auf Responsivität geachtet. Für die beste Nutzererfahrung sollte die Displaygröße auf <kbd>1536x864</kbd> gesetzt werden.
