# Documentation

## 1. Einleitung

Bei ReadR handelt es sich um eine Web-Applikation, die das Lesen und Veröffentlichen von Romanen ermöglicht. Optimiert wird die Anwendung auf das Layout sog. Light-Novels. Anders als bei üblichen Romanen, wird hier i.d.R. in wöchentlichen Intervallen jeweils ein neues Kapitel veröffentlicht, das im Durschnitt ca. 3000 Wörter umfasst. Ziel ist, Nutzern eine zentrale, einheitliche und optisch ansprechende Oberfläche zu bieten.

### 1.1 Anforderungen

#### 1.1.1 Authentifizierung

Benutzer registrieren sich auf der Seite <kbd>/signup</kbd> mittels E-Mail, Nutzername und Passwort. Die Nutzung von Drittanbieter-Authentifizierungsdiensten wie Google oder Facebook wird nicht unterstützt. Nach erfolgreicher Registrierung wird automatisch eine Sitzung für den Nutzer erstellt, die es ihm ermöglicht, sich über die Seite <kbd>/signin</kbd> bei Bedarf erneut anzumelden.

#### 1.1.2 Benutzer

Benutzer haben die Möglichkeit, ihre E-Mail-Adresse und ihren Benutzernamen auf der Seite <kbd>/profile</kbd> anzupassen. Des Weiteren können sie auf der Seite <kbd>/publish</kbd> eigene Geschichten erstellen. Zusätzlich besteht die Option, Geschichten als Favoriten zu markieren und sie der persönlichen Liste auf der Seite <kbd>/favorites</kbd> hinzuzufügen. Kommentare können zu jeder Geschichte beliebig hinzugefügt werden. Ferner können Benutzer die sogenannten 'Insights' auf der Seite <kbd>/novel/{novelId}</kbd> aktivieren und benutzerdefinierte Insights auf der Seite <kbd>/novel/{novelId}/insights</kbd> hinzufügen. Zudem steht es ihnen frei, jedes Kapitel einer Geschichte zu lesen.

#### 1.1.3 Autoren

Autoren sind definiert als Benutzer, die mindestens eine Geschichte erstellt haben. Sie haben die Befugnis, ihre eigenen Geschichten zu verwalten, einschließlich der Anpassung von Name, Beschreibung, Cover, Genre und Status auf der Seite <kbd>/novel/{novelId}/edit</kbd>. Des Weiteren können sie neue Kapitel veröffentlichen und Insights erstellen.

#### 1.1.4 Administratoren

Administratoren sind die einzigen Benutzer, die Zugriff auf die Seite <kbd>/site-settings</kbd> haben. Dort können sie alle Ressourcen in begrenztem Umfang verwalten. Die <kbd>\<Showcase/></kbd> Komponente zeigt eine Diashow von Covern von Geschichten an, deren Auswahl von Administratoren getroffen werden kann. Administratoren können die E-Mail-Adresse, den Nutzernamen oder die Rolle eines jeden Nutzers ändern und Benutzerkonten löschen. Für Genres besteht ausschließlich die Möglichkeit, weitere Einträge hinzuzufügen. Bei Geschichten können Name und Beschreibung geändert und Ressourcen gelöscht werden. Kommentare und Kapitel können nur gelöscht werden. Für jede dieser Einstellungen existiert ein Modal mit einer filterbaren Tabelle.

#### 1.1.5 Insights

Insights sind Zuordnungen von Wörtern (Triggern) zu einem bestimmten Kontext. So kann beispielsweise dem Namen der Protagonisten der Geschichte der Kontext 'Protagonist der Geschichte' hinzugefügt werden. Autoren können einen globalen Kontext für die Geschichte verwalten, während Leser nur benutzerdefinierte Kontexte besitzen. Beim Erstellen eines Insights durch den Autor muss ein Kapitel angegeben werden, ab dem der Kontext in der Geschichte sichtbar wird. Auf diese Weise wird der Kontext nur für Leser angezeigt, die bereits zu dieser Stelle in der Geschichte gelesen haben. Benutzer können Insights pro Geschichte nach Kategorie (global oder benutzerdefiniert) aktivieren oder deaktivieren. Benutzer können einem Trigger nur einen Kontext zuweisen. Es können also auf globaler und benutzerdefinierter Ebene zwei Insights mit gleichem Trigger und jeweils unterschiedlichem Kontext erstellt werden.

## 2. Randbedingungen

Es wird angestrebt, ein einheitliches Design für die Benutzeroberfläche zu verwenden, um eine konsistente Nutzererfahrung zu gewährleisten. Jedoch ist zu vermerken, dass eine vollständige Vereinheitlichung nicht garantiert werden kann. Unterschiede in der Gestaltung können auftreten.

Obwohl auf eine angemessene Fehlerbehandlung geachtet wird, liegt der Fokus nicht primär darauf. In einigen Fällen kann es vorkommen, dass Fehler nicht vollständig behandelt werden, insbesondere wenn sie die grundlegende Funktionsweise der Anwendung nicht beeinflussen und die Nutzung der Anwendung nicht verhindern. Es wird jedoch angestrebt, sicherzustellen, dass kritische Fehler vermieden werden und dass die Anwendung insgesamt robust und zuverlässig ist.

Zusätzlich ist zu beachten, dass nicht alle Funktionalitäten in jeder Form zur Verfügung stehen, da der Umfang des Projekts begrenzt ist. Während sich das Projekt darauf konzentriert, eine Vielzahl von Kernfunktionen bereitzustellen, können einige erweiterte oder spezifische Funktionen möglicherweise nicht implementiert sein. Diese Einschränkung ist hauptsächlich auf den Faktor Zeit zurückzuführen. Dennoch wird angestrebt, die wesentlichen Funktionen bereitzustellen, die für eine effektive Nutzung der Anwendung erforderlich sind.

## 3. Lösungsstrategie

Für die Entwicklung dieser Anwendung wurden verschiedene Technologien und Frameworks verwendet, um eine robuste und benutzerfreundliche Lösung zu gewährleisten. Das Template <kbd>create-t3-app</kbd> diente als Ausgangspunkt für die Projektstruktur und Konfiguration.

![Bausteinsicht](./_assets/bausteinsicht.png)

### 3.1 Next.js

Next.js ist ein Open-Source Full-Stack React Framework. Für diese Anwendung wurde Next.js in der Version 14.1.0 mit dem App-Router verwendet. Als Programmiersprache wurde TypeScript gewählt, da in größeren Anwendungen schnell Typ-Probleme auftreten können. Die Type-Safety, die TypeScript bietet, schafft Sicherheit und ermöglicht es, Fehler schnell zu erkennen.

### 3.2 Prisma

Prisma ist ein Datenbank-Toolkit, das die Interaktion mit Datenbanken in Anwendungen vereinfacht. Es bietet eine deklarative Datenmodellierungssprache, mit der Tabellen und Beziehungen in der Datenbank definiert werden können, ohne dass SQL geschrieben werden muss. Prisma generiert automatisch sicheren und leistungsfähigen Datenbankzugriffscode, der Typsicherheit und eine intuitive API für Datenbankabfragen bietet.

### 3.3 tRPC

tRPC ist ein Framework zur Entwicklung von APIs für TypeScript und JavaScript-Anwendungen. Es ermöglicht die einfache Erstellung von API-Endpunkten mit Typsicherheit und automatischer Codegenerierung. Da das Backend, das Frontend und die Next.js-Middleware verschiedene Laufzeiten besitzen, sind verschiedene <kbd>api</kbd> Instanzen notwendig, um den Zugriff auf den <kbd>appRouter</kbd> aus jeder Laufzeit zu gewährleisten. Der <kbd>appRouter</kbd> besteht aus weiteren Subroutern, die jeweils eine Menge an sog. Prozeduren aufweisen. Eine Prozedur ist in dieser Anwendung ein Element aus {<kbd>publicProcedure</kbd>, <kbd>privateProcedure</kbd>, <kbd>adminProcedure</kbd>}, welche jeweils eine andere Middleware verwenden, um die Berechtigung des Aufrufern zu überprüfen. Über einen Kontext, der in jeder Prozedur als Parameter übergeben wird, kann ein Prisma-Singleton zur Datenbankabfrage und auf den aktuellen Nutzer zugegriffen werden.

### 3.4 Zod

Zod ist eine TypeScript-Bibliothek, die für die Validierung von Datenstrukturen und die Erstellung von Typen entwickelt wurde. Sie ermöglicht Entwicklern, Datenstrukturen zu definieren und Typen zu erstellen, um die Ein- und Ausgaben ihrer Anwendungen zu validieren. Anwendung findet Zod in dieser Anwendung verhäuft in der Definition der Inputs von tRPC-Prozeduren.

### 3.5 Lucia

Lucia ist eine Authentifizierungs- und Autorisierungsbibliothek, die für die Integration von Benutzeranmeldungen und Sitzungsverwaltung in Webanwendungen entwickelt wurde. Sie ermöglicht es Authentifizierungs- und Autorisierungsmechanismen in Anwendungen zu integrieren. Zusätzlich bietet Lucia einen Adapter für Prisma, was die Integration mit der Datenbank stark vereinfacht.

### 3.6 Lucide

Die Lucide Icon Library ist eine umfangreiche Sammlung von Vektor-Symbolen, die für die Verwendung in Webanwendungen optimiert ist.

### 3.7 tailwindcss

Tailwind CSS ist ein anpassbares CSS-Framework, das darauf abzielt, die Gestaltung von Benutzeroberflächen in Webanwendungen zu vereinfachen. Es bietet eine umfangreiche Sammlung von vorgefertigten Utility-Klassen.

### 3.8 shadcn/ui

shadcn/ui ist eine React-Komponentenbibliothek, die für die Entwicklung von modernen und ansprechenden Benutzeroberflächen in Webanwendungen entwickelt wurde. Die Komponenten werden als <kbd>jsx</kbd> bzw. <kbd>tsx</kbd> in das Projekt geladen und können so simpel bearbeitet werden.

## 4. Laufzeitsicht

In diesem Kapitel werden typische Szenarien beschrieben, die während der Laufzeit der Anwendung durch den Nutzer ausgeführt werden können. Es ist wichtig anzumerken, dass die folgenden Beispiele nur eine Auswahl darstellen und nicht alle möglichen Interaktionen mit der Anwendung abbilden.

### 4.1 Registrierung eines Nutzers

Bei Registrierung befindet sich der Nutzer auf der <kbd>/signup</kbd> Seite. Nach Angabe einer E-Mail, eines Nutzernames, des Passworts und einer Wiederholung dessen kann der Nutzer auf den Sign-up-Button klicken. Das Formular bzw. dessen Inhalt werden an die <kbd>handleSignUp</kbd> Server-Action geschickt, welche zuerst die eingegebenen Daten validiert. Zum einen müssen E-Mail und Nutzername einzigartig sein - dürfen also nicht bereits verwendet werden. Zum anderen müssen die eingegebenen Passwörter übereinstimmen und minimale Anforderungen erfüllen. Sind diese Voraussetzungen gegeben, wird der Nutzer in Datenbank mit zufälliger UUID als Primärschlüssel und gehashtem Passwort angelegt und anschließend zurück auf die Startseite geleitet. Zudem erstellt die Server-Action - sofern die eingegebenen Daten valide sind - einen Cookie <kbd>auth_session</kbd>, der die Session-ID beinhaltet.
Für den Fall, dass Daten eingegeben wurden, die nicht valide sind - wie bspw. eine bereits verwendete E-Mail oder nicht übereinstimmende Passwörter - wird nach Absendung in dem Formular eine Fehlermeldung angezeigt.

### 4.2 Authentifizierung eines Nutzers

Die Authentifizierung des Nutzers erfolgt ausschließlich über die in den Cookies hinterlegte Session-ID. Bei Anfrage einer Ressource wird immer zuerst die <kbd>middleware</kbd> der Anwendung ausgeführt. Durch den Request-Paramter der Middleware-Funktion kann auf die Cookies und den angefragten Pfad zugegriffen werden. Je nachdem, welcher Pfad angefragt wurde, wird eine andere Validierung durchgeführt. Pfade wie <kbd>/</kbd>, <kbd>/signin</kbd>, <kbd>/signup</kbd> und <kbd>/api</kbd> werden nicht weiter validiert und jedem - auch nicht authentifiziertem Nutzer - bereitgestellt. Andere Anfragen setzen voraus, dass ein <kbd>auth_session</kbd> Cookie existiert und in der Datenbank zu der ID ein Eintrag gefunden werden kann. Anfragen auf <kbd>/site-settings</kbd> erfordern, dass der Nutzer die <kbd>ADMIN</kbd> Rolle besitzt. Die Autorisierung der Nutzung der API erfolgt über die in 3.3 genannten verschiedenen Prozeduren, welchen eine anderen Middleware zugrunde liegt.

### 4.3 Erstellung einer Geschichte

Das Erstellen einer Geschichte erfolgt auf der <kbd>/publish</kbd> Seite. Nach Angabe von Name, Genre, Beschreibung und eines Covers werden die Inhalte des Formulars an die <kbd>handleCreateNovel</kbd> Server-Action gesendet. Dort werden zuerst die eingegebenen Daten validiert. Anschließend wird über die <kbd>create</kbd> Prozedur des <kbd>novelRouter</kbd> eine neue Geschichte in der Datenbank persistiert. Der Nutzer wird daraufhin nach <kbd>/novel/{novelId}/edit</kbd> weitergeleitet. Das Cover wird nicht in der Datenbank, sondern in dem <kbd>public</kbd> Verzeichnis unter <kbd>/cover/{novelId}</kbd> gespeichert.

### 4.4 Verwalten von Insights

#### 4.4.1 Aus Sicher eines Nutzers

Bevor Nutzer die Insights einer Geschichte verwalten können, müssen diese zuerst aktiviert werden. Das Geschieht durch Klicken des entsprechenden Buttons auf der Startseite der jeweiligen Geschichte (<kbd>/novel/{novelId}</kbd>). Daraufhin wird die Geschichte unter <kbd>/insights</kbd> gelistet und dargestellt, welche Insights aktiviert bzw. deaktiviert sind. Durch Klicken auf eine der dargestellten Karten, wird nach <kbd>/novel/{novelId}/insights</kbd> weitergeleitet. Über den 'Add Insight' Button kann der Nutzer nach Angabe eines Triggers und des darzustellenden Inhalts auf 'Create' klicken. Die Daten des Formulars werden an die <kbd>addNovelInsight</kbd> Server-Action gesendet und dort durch die <kbd>createCustom</kbd> Prozedur des <kbd>insightRouter</kbd> erstellt und anschließend auf der Seite dargestellt. Die vom Nutzer erstellen Insights können jederzeit bearbeitet oder gelöscht werden. Die global für die Geschichte geltenden, vom Autor erstellen, Insights können nicht bearbeitet werden. Alle selbst erstellten oder global geltenden Insights können jeweils deaktiviert werden. Dazu ist lediglich notwendig, auf den aktuellen Status ('Active' oder 'Inactive') zu klicken und den jeweils anderen Status auszuwählen. In dem Fall wird die <kbd>setInsightState</kbd> Prozedur des <kbd>novelRouter</kbd> aufgerufen.

#### 4.4.2 Aus Sicher eines Autors

Autoren stehen auf der <kbd>/novel/{novelId}/insights</kbd> Seite die gleichen Möglichkeiten wie eines normalen Nutzers zur Verfügung. Nachdem für die Geschichte ein Kapitel erstellt wurde, erscheint auf <kbd>/novel/{novelId}/edit</kbd> eine weitere Karte, die das Erstellen von globalen Insights ermöglicht. Dort muss neben einem Trigger und dem Inhalt auch ein Kapitel angegeben werden, ab dem das Insight für Leser angezeigt werden soll. Hier wird die <kbd>handleInsightCreate</kbd> Server-Action aufgerufen, die die <kbd>createGlobal</kbd> Prozedur des <kbd>insightRouter</kbd> aufruft.

### 4.5 Zugriff auf nicht autorisierte Ressourcen

Die Zugriffsberechtigung auf Ressourcen, für die der aktuelle Nutzer nicht autorisiert ist, wird auf verschiedene Wege gewährleistet. Einerseits gibt es die <kbd>middleware</kbd>, welche die Session eines Nutzers ausliest und anhand der Existenz dieser bzw. die mit dem Nutzer verbundene Rolle entscheidet, ob der Zugriff gewährt werden soll, oder nicht. Die Middleware ist jedoch nicht dafür geeignet, spezifischere Einschränkungen zu realisieren. Lediglich der Autor der Geschichte darf auf die <kbd>/novel/{novelId}/edit</kbd> Seite der Geschichte zugreifen. In solchen Fällen wird auf der Seite selbst geprüft, ob der aktuelle Nutzer der Autor der Geschichte ist. Für den Fall, dass er das nicht ist, wird die von Next.js bereitgestellt <kbd>notFound</kbd> Funktion aufgerufen, welche die <kbd>not-found.ts</kbd> Datei lädt. Durch die verschiedenen in 3.3 erwähten Prozeduren werden auch im Backend die nötigen Restriktionen gesetzt.

## 5. Architekturentscheidungen

Die Architekturentscheidungen für diese Anwendung basieren auf verschiedenen Faktoren. Die Wahl von Next.js als Haupt-Framework ergab sich aus meiner bereits vorhandenen Erfahrung und dem Wunsch, meine Fähigkeiten weiter zu vertiefen. Die Entscheidung für Prisma und tRPC war indirekt, da sie Teil der <kbd>create-t3-app</kbd> waren, die ich als Ausgangspunkt für mein Projekt wählte. Lucia wurde aufgrund ihrer Einfachheit und Flexibilität ausgewählt, da andere Authentifizierungslösungen oft eine kompliziertere Konfiguration erforderten oder nicht meine Anforderungen erfüllten.
