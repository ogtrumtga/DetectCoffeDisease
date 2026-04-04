@echo off
echo ========================================
echo XOA CACHE VA RESTART APP
echo ========================================
echo.

echo Dang xoa cache Expo...
echo.

REM Xoa thu muc .expo
if exist .expo (
    echo Xoa thu muc .expo...
    rmdir /s /q .expo
    echo   Done!
) else (
    echo   Thu muc .expo khong ton tai
)

REM Xoa node_modules/.cache
if exist node_modules\.cache (
    echo Xoa node_modules\.cache...
    rmdir /s /q node_modules\.cache
    echo   Done!
)

REM Xoa metro cache
if exist %TEMP%\metro-* (
    echo Xoa Metro cache...
    del /q %TEMP%\metro-*
    echo   Done!
)

if exist %TEMP%\react-* (
    echo Xoa React Native cache...
    del /q %TEMP%\react-*
    echo   Done!
)

echo.
echo ========================================
echo CACHE DA DUOC XOA!
echo ========================================
echo.
echo Bay gio chay lenh:
echo   npx expo start -c
echo.
echo Hoac nhan phim bat ky de tu dong chay...
pause

echo.
echo Dang start Expo voi cache clear...
npx expo start -c
