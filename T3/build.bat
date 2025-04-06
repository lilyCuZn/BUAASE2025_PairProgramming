@echo off
:: 切换到 t3-as 文件夹并运行构建命令
cd t3-as

echo processing npm run asbuild...
call npm run asbuild

cd ..

:: 复制文件到 t3-snake-1-bbb/pkg
echo copy to t3-snake-1-bbb/pkg...
copy /Y ".\t3-as\build\release.js" ".\t3-snake-2-bbb\pkg"
if errorlevel 1 (
    echo error: copy failure
    pause
    exit /b 1
)
copy /Y ".\t3-as\build\release.wasm" ".\t3-snake-2-bbb\pkg"
if errorlevel 1 (
    echo error: copy failure 2
    pause
    exit /b 1
)

:: 复制文件到 t3-snake-2-bbb/pkg
@REM echo copy to t3-snake-2-bbb/pkg...
@REM copy /Y ".\t3-as\build\release.js" ".\t3-snake-2-bbb\pkg"
@REM if errorlevel 1 (
@REM     echo error: copy failure 3
@REM     pause
@REM     exit /b 1
@REM )
@REM copy /Y ".\t3-as\build\release.wasm" ".\t3-snake-2-bbb\pkg"
@REM if errorlevel 1 (
@REM     echo error：copy failure 4
@REM     pause
@REM     exit /b 1
@REM )

:: 运行提交测试命令
echo processing npm run submit-test...
call npm run submit-test

pause