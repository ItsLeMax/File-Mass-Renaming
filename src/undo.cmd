@echo off

cls

set /p "confirm=Are you sure? | Bist du dir sicher? < 1 (yes) | 0 (no) >: "
if /i "%confirm%" EQU "1" ("C:\Program Files\nodejs\node.exe" undo.js) else (
    echo Die Eingabe wurde abgebrochen.
)

pause