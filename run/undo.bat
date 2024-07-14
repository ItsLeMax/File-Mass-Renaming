@echo off
Title File Mass Renaming - Undo

cls

set /p "confirm=Are you sure? | Bist du dir sicher? < 1 (yes) | 0 (no) >: "
if /i "%confirm%" EQU "1" (node ../src/undo.js) else (
    echo Die Eingabe wurde abgebrochen.
	echo The input has been aborted.
)

pause