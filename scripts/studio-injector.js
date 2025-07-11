#!/usr/bin/env node

/**
 * Script d'injection directe dans les assets Studio
 * Modifie directement les fichiers statiques du Studio
 */

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

class StudioInjector {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..')
    this.studioAssetsPath = path.resolve(this.projectRoot, 'packages/bp/dist/data/assets/studio/ui/public')
    this.backupSuffix = '.original'
  }

  async inject() {
    console.log(chalk.blue('🚀 Injection des personnalisations dans Studio...'))

    try {
      await this.injectCustomCSS()
      await this.injectCustomJS()
      await this.createCustomAssets()
      console.log(chalk.green('✅ Injection terminée avec succès !'))
    } catch (error) {
      console.error(chalk.red('❌ Erreur lors de l\'injection:', error.message))
      throw error
    }
  }

  async restore() {
    console.log(chalk.blue('♻️ Restauration des assets Studio originaux...'))

    try {
      await this.restoreOriginalFiles()
      console.log(chalk.green('✅ Restauration terminée !'))
    } catch (error) {
      console.error(chalk.red('❌ Erreur lors de la restauration:', error.message))
      throw error
    }
  }

  async injectCustomCSS() {
    const indexPath = path.join(this.studioAssetsPath, 'index.html')

    // Backup original
    if (!(await fs.pathExists(indexPath + this.backupSuffix))) {
      await fs.copy(indexPath, indexPath + this.backupSuffix)
    }

    let content = await fs.readFile(indexPath, 'utf8')

    const customCSS = `
    <style id="tybot-custom-styles">
      /* === TYBOT BOTFLOW BUILDER - STYLE UI-ADMIN === */
      :root {
        --tybot-primary: #007bff;
        --tybot-secondary: #6c757d;
        --tybot-dark: rgb(53, 4, 40);
        --tybot-success: #28a745;
        --tybot-danger: #dc3545;
        --tybot-warning: #ffc107;
        --tybot-info: #17a2b8;
        --tybot-light: #f8f9fa;
        --tybot-navbar-bg: rgb(53, 4, 40);
        --tybot-sidebar-bg: rgb(53, 4, 40);
        --tybot-active-border: rgb(215, 128, 192);
        --tybot-text: var(--seashell);
      }

      /* === TITRE DE PAGE === */
      title {
        display: none;
      }

      /* === HEADER/NAVBAR - GARDER COULEUR ORIGINALE === */
      .bp3-navbar,
      [class*="navbar"],
      .navbar,
      header {
        /* Garder les couleurs originales du header Studio */
        background-color: inherit !important;
        background: inherit !important;
        border-bottom: 1px solid #495057 !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        min-height: 60px !important;
      }

      /* === LOGO AVEC IMAGE UI-ADMIN === */
      .bp-logo,
      [class*="logo"],
      .logo,
      .navbar-brand {
        display: flex !important;
        align-items: center !important;
        font-weight: bold !important;
        text-decoration: none !important;
        font-size: 18px !important;
      }

      /* Icône avec l'image du logo UI-Admin */
      .bp-logo::before,
      [class*="logo"]::before,
      .logo::before,
      .navbar-brand::before {
        width: 20px !important;
        height: 20px !important;
        margin-right: 8px !important;
        background-image: url('./custom/logo-icon.svg') !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        display: inline-block !important;
      }

      .bp-logo::after,
      [class*="logo"]::after,
      .logo::after,
      .navbar-brand::after {
        content: "⇦" !important;
        font-size: 22px !important;
        font-weight: bold !important;
      }

      /* Cacher le logo original */
      .bp-logo img,
      [class*="logo"] img,
      .logo img,
      .navbar-brand img {
        display: none !important;
      }

      /* Cacher le texte original du logo */
      .bp-logo span,
      [class*="logo"] span:not(.tybot-title),
      .logo span,
      .navbar-brand span:not(.tybot-title) {
        display: none !important;
      }

      /* === SUPPRIMER SECTION HELP === */
      /* Sélecteurs pour supprimer les liens d'aide, forum, documentation */
      [href*="https://discord.com/invite/botpress"],
      [href*="https://v12.botpress.com/"],
      [href*="docs"],
      [href*="documentation"],
      .help-section,
      .bp3-menu-item[text*="Help"],
      .bp3-menu-item[text*="Documentation"],
      .bp3-menu-item[text*="Forum"],
      button[title*="Help"],
      button[title*="Documentation"],
      a[title*="Help"],
      a[title*="Documentation"] {
        display: none !important;
      }

      /* === SIDEBAR STYLE UI-ADMIN === */
      .bp3-drawer,
      .bp-sidebar,
      [class*="sidebar"],
      .sidebar {
        background: var(--tybot-sidebar-bg) !important;
        color: var(--tybot-text) !important;
        border-right: 1px solid #495057 !important;
        width: 40px !important;
      }

      .bp3-drawer .bp3-menu,
      .bp-sidebar .bp3-menu,
      .sidebar .bp3-menu {
        background: transparent !important;
      }

      .bp3-drawer .bp3-menu-item,
      .bp-sidebar .bp3-menu-item,
      .sidebar .bp3-menu-item {
        color: var(--tybot-text) !important;
        border-radius: 4px !important;
        margin: 2px 8px !important;
        height: 30px !important;
        width: 30px !important;
        border-left: solid 2px transparent !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      /* Icônes du sidebar - utiliser le logo UI-Admin */
      .bp3-drawer .bp3-menu-item .bp3-icon,
      .bp-sidebar .bp3-menu-item .bp3-icon,
      .sidebar .bp3-menu-item .bp3-icon,
      /* Ciblage spécifique pour le Studio */
      .sidebar-container .bp3-icon,
      .studio-sidebar .bp3-icon,
      nav .bp3-icon {
        background-image: url('./custom/logo-icon.svg') !important;
        background-size: 16px 16px !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        width: 16px !important;
        height: 16px !important;
        position: relative !important;
      }

      /* Masquer le contenu SVG original des icônes pour laisser place au background */
      .bp3-drawer .bp3-menu-item .bp3-icon svg,
      .bp-sidebar .bp3-menu-item .bp3-icon svg,
      .sidebar .bp3-menu-item .bp3-icon svg,
      .sidebar-container .bp3-icon svg,
      .studio-sidebar .bp3-icon svg,
      nav .bp3-icon svg {
        opacity: 0 !important;
        visibility: hidden !important;
      }

      /* Alternative: utiliser ::before pour superposer le logo */
      .bp3-drawer .bp3-menu-item .bp3-icon::before,
      .bp-sidebar .bp3-menu-item .bp3-icon::before,
      .sidebar .bp3-menu-item .bp3-icon::before,
      .sidebar-container .bp3-icon::before,
      .studio-sidebar .bp3-icon::before,
      nav .bp3-icon::before {
        content: "" !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 16px !important;
        height: 16px !important;
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgNzY4IDc2OCI+CiAgPHBhdGggZD0iTTM2OSAxLjc5NjkyQzQwMSAxLjEzMjEyIDQ0MSAxNS4yNDA5NyA0NjcgMzYuMDU0N0M0NzEgMzkuMjM3NiA0NzMgNDIuODg1MiA0NzUgNDYuOTIxOUM0NzUgNDcuNzA2MiA0NzUgNDguNDkwNSA0NzUgNDkuMjk2OUM0NzYgNDkuMjk2OSA0NzcgNDkuMjk2OSA0NzggNDkuMjk2OUM0ODEgNTUuMTQwNCA0ODMgNjAuODI5NCA0ODQgNjYuODA0N0M0ODUgNjkuNjI4OCA0ODYgNzIuMzY3NCA0ODcgNzUuMTI5NUM0ODkgNzkuNDkxNyA0OTAgODMuOTMwNSA0OTEgODguMzU5NEM0OTMgOTUuMDY2NCA0OTUgMTAxLjc1OTggNDk3IDEwOC40MjJDNDk4IDEwOC40MjIgNDk5IDEwOC40MjIgNTAwIDEwOC40MjJDNTAyIDExMS40MjIgNTAyIDExMS40MjIgNTAyIDExNC40MjJDNTAzIDExNC43NTIgNTA0IDExNS4wODIgNTA1IDExNS40MjJDNTA2IDExNy45ODQgNTA2IDExNy45ODQgNTA3IDEyMC40MjJDNTA4IDEyMC40MjIgNTA4IDEyMC40MjIgNTA5IDEyMC40MjJDNTA5IDE2LjEzMiA1MDkgMTExLjg0MiA1MDkgMTA3LjQyMkM1MTQgMTA3LjI0NSA1MTggMTA3LjU1IDUyMyAxMDguOTExQzUyNyAxMDkuOTA3IDUzMSAxMTAuMTE0IDUzNiAxMTAuNDIyQzUzNSAxMTMuMjA2IDUzMyAxMTMuNDAxIDUzMCAxMTQuNDIyQzUzMSAxMTQuNjc4IDUzMSAxMTQuNjc4IDUzMiAxMTQuOTM5QzUzMyAxMTUuMzAyIDUzMyAxMTUuMzAyIDUzNCAxMTUuNjczQzUzNSAxMTUuOTA1IDUzNiAxMTYuMTM3IDUzNyAxMTYuMzc2QzU0MCAxMTcuNjQ1IDU0MCAxMTguNzQ4IDU0MSAxMjEuNDIyQzUzOCAxMjMuNDcxIDUzNiAxMjMuOTczIDUzMyAxMjQuNjc3QzUzMiAxMjQuODkyIDUzMSAxMjUuMTA3IDUzMCAxMjUuMzI4QzUyOCAxMjUuNjU0IDUyOCAxMjUuNjU0IDUyNiAxMjUuOTg3QzUyNCAxMjYuNDIyIDUyMiAxMjYuODYxIDUxOSAxMjcuMzAzQzUxOCAxMjcuNDk0IDUxNyAxMjcuNjg1IDUxNiAxMjcuODgzQzUxNCAxMjguMzI0IDUxNCAxMjguMzI0IDUxMiAxMjkuNDIyQzUxMCAxMjkuNzAxIDUwOCAxMjkuOTUzIDUwNiAxMzAuMTkxQzQ5OCAxMzEuMzM5IDQ5MSAxMzMuNjM2IDQ4NCAxMzYuMTc2QzQ4MyAxMzYuNjMxIDQ4MiAxMzcuMDg1IDQ4MSAxMzcuNTM5QzQ3MyAxNDAuMTU0IDQ2NSAxNDIuOTUgNDU4IDEzNi4wNzJaTTM3NCAxNzVDMzc3IDIwNi42MTMgMzk5IDI3My4wOSA0NzEgMzI5IDQ3MSAzMDAgNDcxIDI3MSA0NzEgMjQyIDQ3MiAyNDIgNDczIDI0MiA0NzQgMjQyIDQ3NCAzNDkgNDc0IDQ1NiA0NzQgNTYzQzQ3NCA1NjQuNDMgNDc0IDU2NS44NiA0NzQgNTY3LjI5QzQ3OSA1NzMuOTMzIDQ3OSA1NzMuOTMzIDQ4MiA1ODMgWiIgZmlsbD0iIzc2NTE5MiIvPgo8L3N2Zz4K') !important;
        background-size: 16px 16px !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        z-index: 1000 !important;
      }

      .bp3-drawer .bp3-menu-item:hover,
      .bp-sidebar .bp3-menu-item:hover,
      .sidebar .bp3-menu-item:hover {
        background: none !important;
        color: var(--tybot-text) !important;
        border-left-color: var(--gray) !important;
      }

      .bp3-drawer .bp3-menu-item.bp3-selected,
      .bp-sidebar .bp3-menu-item.bp3-selected,
      .sidebar .bp3-menu-item.bp3-selected,
      .bp3-drawer .bp3-menu-item.active,
      .bp-sidebar .bp3-menu-item.active,
      .sidebar .bp3-menu-item.active {
        background: none !important;
        color: var(--tybot-text) !important;
        border-left-color: var(--tybot-active-border) !important;
      }

      /* === BOUTONS STYLE UI-ADMIN === */
      .bp3-button.bp3-intent-primary,
      .bp-button-primary,
      .btn-primary {
        background: var(--tybot-primary) !important;
        border-color: var(--tybot-primary) !important;
        color: white !important;
      }

      .bp3-button.bp3-intent-primary:hover,
      .bp-button-primary:hover,
      .btn-primary:hover {
        background: #0056b3 !important;
        border-color: #0056b3 !important;
      }

      .bp3-button.bp3-intent-success {
        background: var(--tybot-success) !important;
        border-color: var(--tybot-success) !important;
      }

      .bp3-button.bp3-intent-danger {
        background: var(--tybot-danger) !important;
        border-color: var(--tybot-danger) !important;
      }

      .bp3-button.bp3-intent-warning {
        background: var(--tybot-warning) !important;
        border-color: var(--tybot-warning) !important;
      }

      /* === FLOW DESIGNER === */
      .bp-flow-node,
      [class*="flow-node"] {
        border-radius: 6px !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        border: 2px solid #e9ecef !important;
        transition: all 0.2s ease !important;
      }

      .bp-flow-node:hover,
      [class*="flow-node"]:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        transform: translateY(-1px) !important;
      }

      .bp-flow-node.selected,
      [class*="flow-node"].selected {
        border-color: var(--tybot-primary) !important;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25) !important;
      }

      /* === PANNEAU DE PROPRIÉTÉS === */
      .bp-properties-panel,
      [class*="properties-panel"] {
        background: var(--tybot-light) !important;
        border-left: 1px solid #dee2e6 !important;
      }

      /* === NOTIFICATIONS === */
      .bp3-toast {
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }

      .bp3-toast.bp3-intent-primary {
        border-left: 4px solid var(--tybot-primary) !important;
      }

      .bp3-toast.bp3-intent-success {
        border-left: 4px solid var(--tybot-success) !important;
      }

      .bp3-toast.bp3-intent-warning {
        border-left: 4px solid var(--tybot-warning) !important;
      }

      .bp3-toast.bp3-intent-danger {
        border-left: 4px solid var(--tybot-danger) !important;
      }

      /* === SUPPRIMER INDICATEURS DE STATUS === */
      .tybot-status-indicator {
        display: none !important;
      }

      /* === ANIMATIONS SUBTILES === */
      @keyframes tybotFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .tybot-fade-in {
        animation: tybotFadeIn 0.3s ease !important;
      }

      /* === RESPONSIVE === */
      @media (max-width: 768px) {
        .bp-logo::after,
        [class*="logo"]::after,
        .logo::after,
        .navbar-brand::after {
          content: "Tybot" !important;
          font-size: 16px !important;
        }
      }

      /* Indicateur de status personnalisé - SUPPRIMÉ */
    </style>`

    // Injecter le CSS avant la fermeture de </head>
    if (!content.includes('tybot-custom-styles')) {
      content = content.replace('</head>', customCSS + '\n</head>')
      await fs.writeFile(indexPath, content)
      console.log(chalk.green('✓ CSS personnalisé injecté'))
    } else {
      console.log(chalk.yellow('⚠ CSS personnalisé déjà présent'))
    }
  }

  async injectCustomJS() {
    const indexPath = path.join(this.studioAssetsPath, 'index.html')
    let content = await fs.readFile(indexPath, 'utf8')

    const customJS = `
    <script id="tybot-custom-script">

      function removeHelpElements() {
          const selectors = [
            'a[href*="forum"]', 'a[href*="help"]', 'a[href*="docs"]',
            'button[title*="Help"]', 'button[title*="Documentation"]',
            '.help-section', '.documentation-section'
          ];

          selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
          });

          // Supprimer menus avec texte "help" ou "documentation"
          document.querySelectorAll('.bp3-menu-item, [role="menuitem"]').forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes('help') || text.includes('documentation') || text.includes('forum')) {
              item.remove();
            }
          });
        }
      // === TYBOT BOTFLOW BUILDER ===
      console.log('%c🚀 Tybot BotFlow Builder activé !', 'color: #007bff; font-weight: bold; font-size: 16px;');

      // Attendre que le DOM soit chargé
      document.addEventListener('DOMContentLoaded', function() {
        // Changer le titre de la page
        document.title = 'Tybot BotFlow Builder';

        // Ajouter l'icône de page
        const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        favicon.href = './custom/logo-icon.svg';
          document.head.appendChild(favicon);

        // Hooks pour intercepter les actions
        window.tybotBotFlow = {
          version: '1.0.0',
          features: {
            customUI: true,
            debugMode: true,
            enhancedNLU: true
          },
          utils: {
            log: (msg) => console.log('%c[TybotBotFlow]', 'color: #007bff;', msg),
            pulse: (element) => element.classList.add('tybot-pulse')
          }
        };
        removeHelpElements();
        // Observer pour détecter les nouveaux éléments
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                // Appliquer les styles aux nouveaux éléments
                if (node.classList && node.classList.contains('bp-flow-node')) {
                  node.style.transition = 'all 0.3s ease';
                }
              }
            });
          });
          removeHelpElements();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });

      // Hook global pour les erreurs
      window.addEventListener('error', function(e) {
        console.log('%c[TybotBotFlow Error Handler]', 'color: #007bff;', e.message);
      });
    </script>
`

    // Injecter le JS avant la fermeture de </body>
    if (!content.includes('tybot-custom-script')) {
      content = content.replace('</body>', customJS + '\n</body>')
      await fs.writeFile(indexPath, content)
      console.log(chalk.green('✓ JavaScript personnalisé injecté'))
    } else {
      console.log(chalk.yellow('⚠ JavaScript personnalisé déjà présent'))
    }
  }

  async createCustomAssets() {
    const customAssetsDir = path.join(this.studioAssetsPath, 'custom')
    await fs.ensureDir(customAssetsDir)

    // Copier le logo SVG personnalisé
    const logoSourcePath = path.join(this.projectRoot, 'studio-custom/assets/logo-icon.svg')
    const logoDestPath = path.join(customAssetsDir, 'logo-icon.svg')

    if (await fs.pathExists(logoSourcePath)) {
      await fs.copy(logoSourcePath, logoDestPath)
      console.log(chalk.green('✓ Logo SVG copié'))
    } else {
      console.log(chalk.yellow('⚠ Logo SVG non trouvé, utilisation du logo par défaut'))
    }

    // Créer un fichier de configuration personnalisé
    const config = {
      version: '1.0.0',
      theme: 'tybot-enhanced',
      features: {
        customSidebar: true,
        enhancedButtons: true,
        customAnimations: true
      },
      colors: {
        primary: '#e74c3c',
        secondary: '#2c3e50',
        accent: '#f39c12',
        success: '#27ae60'
      }
    }

    await fs.writeFile(
      path.join(customAssetsDir, 'tybot-config.json'),
      JSON.stringify(config, null, 2)
    )

    console.log(chalk.green('✓ Assets personnalisés créés'))
  }

  async restoreOriginalFiles() {
    const indexPath = path.join(this.studioAssetsPath, 'index.html')
    const backupPath = indexPath + this.backupSuffix

    if (await fs.pathExists(backupPath)) {
      await fs.copy(backupPath, indexPath)
      console.log(chalk.green('✓ index.html restauré'))
    }

    // Supprimer les assets personnalisés
    const customAssetsDir = path.join(this.studioAssetsPath, 'custom')
    if (await fs.pathExists(customAssetsDir)) {
      await fs.remove(customAssetsDir)
      console.log(chalk.green('✓ Assets personnalisés supprimés'))
    }
  }
}

// CLI
if (require.main === module) {
  const injector = new StudioInjector()
  const command = process.argv[2]

  switch (command) {
    case 'inject':
      injector.inject().catch(console.error)
      break
    case 'restore':
      injector.restore().catch(console.error)
      break
    default:
      console.log(chalk.yellow('Usage: node studio-injector.js [inject|restore]'))
      console.log(chalk.gray('  inject  - Injecter les personnalisations'))
      console.log(chalk.gray('  restore - Restaurer les fichiers originaux'))
  }
}

module.exports = StudioInjector
