# Configuración de Node Version Manager (nvm)

## 📦 Archivos Creados

- ✅ `.nvmrc` - Especifica Node.js v20
- ✅ `package.json` actualizado con `engines` field

## 🚀 Instalación de nvm

### macOS / Linux

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# O usando wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

### Reinicia tu terminal o ejecuta:

```bash
source ~/.zshrc   # Si usas zsh (macOS default)
# o
source ~/.bashrc  # Si usas bash
```

### Verifica la instalación:

```bash
nvm --version
# Debe mostrar: 0.40.0 o similar
```

## 🎯 Uso del Proyecto

### 1. Instalar la versión de Node especificada

```bash
cd /Users/gvelarde/Downloads/kaax-landing
nvm install
# ✅ Automáticamente lee .nvmrc e instala Node 20
```

### 2. Usar la versión correcta

```bash
nvm use
# ✅ Cambia a Node 20 especificado en .nvmrc
```

### 3. (Opcional) Hacer Node 20 tu versión por defecto

```bash
nvm alias default 20
```

## ⚡ Auto-switch con .nvmrc

### Zsh (Recomendado)

Agrega esto a tu `~/.zshrc`:

```bash
# Auto-switch node version cuando entras a un directorio con .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

Luego reinicia tu terminal o:

```bash
source ~/.zshrc
```

## 🔍 Verificación

```bash
cd /Users/gvelarde/Downloads/kaax-landing
node --version
# Debe mostrar: v20.x.x

npm --version
# Debe mostrar: 10.x.x o superior
```

## 📚 Comandos Útiles de nvm

```bash
# Ver versiones instaladas
nvm ls

# Ver versiones disponibles
nvm ls-remote

# Instalar versión específica
nvm install 20.11.0

# Usar versión específica
nvm use 20

# Ver versión actual
nvm current

# Desinstalar versión
nvm uninstall 18

# Ver ruta de Node actual
which node
```

## ⚠️ Troubleshooting

### "nvm: command not found"

1. Verifica que nvm esté instalado:
   ```bash
   ls -la ~/.nvm
   ```

2. Agrega manualmente a tu shell config:
   ```bash
   # Para zsh (~/.zshrc)
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
   ```

3. Recarga tu shell:
   ```bash
   source ~/.zshrc
   ```

### "No .nvmrc file found"

Asegúrate de estar en el directorio del proyecto:
```bash
cd /Users/gvelarde/Downloads/kaax-landing
ls -la .nvmrc
```

### Conflicto con Node global instalado via Homebrew

Si instalaste Node con Homebrew, desinstálalo primero:

```bash
brew uninstall node
brew uninstall node@20
```

Luego instala con nvm:
```bash
nvm install 20
nvm use 20
nvm alias default 20
```

## 🎯 Next.js Requirements

Next.js 15 requiere:
- ✅ Node.js 18.17.0 o superior
- ✅ Node.js 20 es la versión LTS recomendada
- ✅ Este proyecto usa Node 20 (ver `.nvmrc`)

## 🚀 Quick Start

```bash
# 1. Instalar nvm (solo primera vez)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.zshrc

# 2. En el proyecto
cd /Users/gvelarde/Downloads/kaax-landing
nvm install
nvm use

# 3. Instalar dependencias
npm install

# 4. Listo para desarrollo
npm run dev
```

## 📖 Referencias

- [nvm GitHub](https://github.com/nvm-sh/nvm)
- [Next.js System Requirements](https://nextjs.org/docs/getting-started/installation)
- [Node.js Releases](https://nodejs.org/en/about/releases/)
