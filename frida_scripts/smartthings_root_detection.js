Java.perform(() => {
    const debug = false;
    const replacement = '/etc/hello';
    let targetPaths = [
        '/system/app/Superuser.apk',
        '/sbin/su',
        '/system/bin/su',
        '/system/xbin/su',
        '/data/local/xbin/su',
        '/data/local/bin/su',
        '/system/sd/xbin/su',
        '/system/bin/failsafe/su',
        '/data/local/su',
        '/su/bin/su'
    ];
    let targetCmds = [
        'su',
        'which'
    ];
    
    const AppPkgMgr = Java.use("android.app.ApplicationPackageManager");
    const File = Java.use('java.io.File');
    const Runtime = Java.use('java.lang.Runtime');
    const String = Java.use('java.lang.String');
    const Arrays = Java.use('java.util.Arrays');
    
    function debugPrint(msg, level) {
        if (debug) {
            let levelStr = '';
            for (let i = 0; i < level; i++) {
                levelStr += '\t'
            }
            console.log(levelStr + msg);
        }
    }

    function cmdChecker(cmd) {
        let cmdStr = cmd.toString();

        for (let i = 0; i < targetCmds; i++) {
            if (cmdStr.endsWith(targetCmds[i])) {
                console.log('#### Hijacking command: ' + cmdStr);
                return true;
            }
        }

        return false;
    }

    AppPkgMgr.getPackageInfo.overload('java.lang.String', 'int').implementation = function (pkgName, flags) {
        debugPrint('getPackageInfo called', 0);
        debugPrint('Package name: ' + pkgName, 1);
        debugPrint('Flags: ' + flags, 1);

        let pkgNameStr = pkgName.toString();
        
        if (pkgNameStr.includes('busybox')) {
            console.log('#### Hijacking busybox package search for package: ' + pkgName);
            pkgName = 'xyz.hack.helloworld';
        }

        const result = this.getPackageInfo(pkgName, flags);

        return result;
    };

    // File(string) 
    File.$init.overload('java.lang.String').implementation = function (pathname) {
        debugPrint('new File(pathname) called', 0);
        debugPrint('pathname: ' + pathname, 1);

        for (let i = 0; i < targetPaths.length; i++) {
            if (pathname === targetPaths[i]) {
                console.log('#### Hijacking su file search for: ' + pathname);
                pathname = replacement;
            }
        } 

        return this.$init(pathname);
    };

    // exec(String)
    Runtime.exec.overload('java.lang.String').implementation = function (cmd) {
        debugPrint('exec(String) called', 0);
        debugPrint('Cmd: ' + cmd, 1);
        
        if (cmdChecker(cmd)) {
            cmd = replacement; 
        }

        return this.exec(cmd);
    };

    // exec(String, String[])
    Runtime.exec.overload('java.lang.String', '[Ljava.lang.String;').implementation = function (cmd, envp) {
        debugPrint('exec(String, String[]) called', 0);
        debugPrint('Cmd: ' + cmd, 1);
        debugPrint('Envp: ' + Arrays.toString(envp), 1);
        
        if (cmdChecker(cmd)) {
            cmd = replacement; 
        }
        
        return this.exec(cmd, envp);
    };

    // exec(String, String[], File)
    Runtime.exec.overload('java.lang.String', '[Ljava.lang.String;', 'java.io.File').implementation = function (cmd, envp, dir) {
        debugPrint('exec(String, String[], File) called', 0);
        debugPrint('Cmd: ' + cmd, 1);
        debugPrint('Envp: ' + Arrays.toString(envp), 1);
        debugPrint('Dir: ' + dir, 1);
        
        if (cmdChecker(cmd)) {
            cmd = replacement; 
        }
        
        return this.exec(cmd, envp, dir);
    };

    // exec(String[])
    Runtime.exec.overload('[Ljava.lang.String;').implementation = function (cmdArray) {
        debugPrint('exec(String[]) called', 0);
        debugPrint('Cmd: ' + Arrays.toString(cmdArray), 1);

        if (cmdArray.length > 0) {
            if (cmdChecker(cmdArray[0])) {
                cmdArray[0] = String.$new(replacement);
            }
        }
        
        return this.exec(cmdArray);
    };

    // exec(String[], String[])
    Runtime.exec.overload('[Ljava.lang.String;', '[Ljava.lang.String;').implementation = function (cmdArray, envp) {
        debugPrint('exec(String[], String[]) called', 0);
        debugPrint('Cmd: ' + Arrays.toString(cmdArray), 1);
        debugPrint('Envp: ' + Arrays.toString(envp), 1);

        if (cmdArray.length > 0) {
            if (cmdChecker(cmdArray[0])) {
                cmdArray[0] = String.$new(replacement);
            }
        }
        
        return this.exec(cmdArray, envp);
    };

    // exec(String[], String[], File)
    Runtime.exec.overload('[Ljava.lang.String;', '[Ljava.lang.String;', 'java.io.File').implementation = function (cmdArray, envp, dir) {
        debugPrint('exec(String[], String[], File) called', 0);
        debugPrint('Cmd: ' + Arrays.toString(cmdArray), 1);
        debugPrint('Envp: ' + Arrays.toString(envp), 1);
        debugPrint('Dir: ' + dir, 1);

        if (cmdArray.length > 0) {
            if (cmdChecker(cmdArray[0])) {
                cmdArray[0] = String.$new(replacement);
            }
        }

        return this.exec(cmdArray, envp, dir);
    };

});
