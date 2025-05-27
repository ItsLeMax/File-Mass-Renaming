@echo off
Title File Mass Renaming - Script

:start
cls

set /p "path=Path to the files | Pfad zu den Dateien < Explorer-Pfad / Explorer Path | Z:\Folder\Subfolder >: "
set /p "recursion=Loop through sub directories? | Unterordner mit durchgehen? < 1 (yes) | 0 (no) >: "
set /p "toReplace=What is supposed to be replaced inside the file name | Was im Namen der Datei ersetzt werden soll < RegEx / Text | ^.{0,6} >: "
set /p "replaceWith=(Optional) With what is it supposed to be replaced | Womit es ersetzt werden soll < Text | video_ >: "
"C:\Program Files\nodejs\node.exe" ../src/script.js "%path%" "%recursion%" "%toReplace%" "%replaceWith%"

pause
goto start