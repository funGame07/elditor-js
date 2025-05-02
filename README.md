# elditor-js

simple text editor that uses Range and Selection. since execCommand is deprecated

# Instalation

install via npm
```bash
    npm install elditor-js
```

# Usage

if you are using Nodejs/web bundlers
```javascript
    import { Elditor } from 'elditor-js';

    new Elditor(document.getElementById('target'))
```

if you are using cdn(iife)
```html
    <div id='target'></div>

    <script https://unpkg.com/elditor-js/dist/elditor-js.iife.min.js></script>
    <script>
        new ElditorJs.Elditor(document.getElementById('target'));
    </script>
```

if you are using cdn(esm)
```html
    <script type="module">
        import { Elditor } from 'https://esm.sh/elditor-js';
        new Elditor(document.getElementById('target'));
    </script>   
```

# Info

you may find some bugs on my text editor. hehe

