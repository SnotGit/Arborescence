import { useState, useEffect } from 'react';
import { Folder, FolderOpen, File, FolderPlus, FilePlus } from 'lucide-react';

const FileTreeBuilder = () => {
  // 2. Modifier les useState pour charger depuis localStorage
  const [tree, setTree] = useState(() => {
    const saved = localStorage.getItem('fileTree');
    return saved ? JSON.parse(saved) : {
      id: 'root',
      name: 'mon-projet',
      type: 'folder',
      children: [
        { id: 'index', name: 'index.html', type: 'html' },
        { id: 'main', name: 'main.css', type: 'css' }
      ]
    };
  });

  const [openFolders, setOpenFolders] = useState(() => {
    const saved = localStorage.getItem('openFolders');
    return saved ? new Set(JSON.parse(saved)) : new Set(['root']);
  });

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // 3. Ajouter les useEffect pour sauvegarder automatiquement
  useEffect(() => {
    localStorage.setItem('fileTree', JSON.stringify(tree));
  }, [tree]);

  useEffect(() => {
    localStorage.setItem('openFolders', JSON.stringify([...openFolders]));
  }, [openFolders]);

  // Fonction de tri automatique : dossiers en premier, puis alphabétique
  const sortTreeRecursively = (item) => {
    if (item.children && item.children.length > 0) {
      const sortedChildren = item.children
        .map(sortTreeRecursively) // Trier récursivement chaque enfant
        .sort((a, b) => {
          // Dossiers en premier
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (a.type !== 'folder' && b.type === 'folder') return 1;
          // Puis tri alphabétique (insensible à la casse)
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
      return { ...item, children: sortedChildren };
    }
    return item;
  };

  const templates = {
    simple: {
      name: 'Simple',
      structure: {
        id: 'root',
        name: 'mon-projet',
        type: 'folder',
        children: [
          { id: 'index', name: 'index.html', type: 'html' },
          { id: 'main', name: 'main.css', type: 'css' }
        ]
      }
    },
    angular: {
      name: 'Angular',
      structure: {
        id: 'root',
        name: 'angular-app',
        type: 'folder',
        children: [
          {
            id: 'src', name: 'src', type: 'folder', children: [
              {
                id: 'app', name: 'app', type: 'folder', children: [
                  { id: 'app-component', name: 'app.component.ts', type: 'file' },
                  { id: 'app-module', name: 'app.module.ts', type: 'file' },
                  { id: 'app-html', name: 'app.component.html', type: 'file' }
                ]
              },
              { id: 'main-ts', name: 'main.ts', type: 'file' },
              { id: 'styles-css', name: 'styles.css', type: 'file' }
            ]
          },
          { id: 'angular-json', name: 'angular.json', type: 'file' },
          { id: 'package-json', name: 'package.json', type: 'file' }
        ]
      }
    },
    dotnet: {
      name: '.NET',
      structure: {
        id: 'root',
        name: 'dotnet-app',
        type: 'folder',
        children: [
          {
            id: 'controllers', name: 'Controllers', type: 'folder', children: [
              { id: 'home-controller', name: 'HomeController.cs', type: 'file' }
            ]
          },
          {
            id: 'models', name: 'Models', type: 'folder', children: [
              { id: 'user-model', name: 'User.cs', type: 'file' }
            ]
          },
          {
            id: 'views', name: 'Views', type: 'folder', children: [
              {
                id: 'home', name: 'Home', type: 'folder', children: [
                  { id: 'index-cshtml', name: 'Index.cshtml', type: 'file' }
                ]
              }
            ]
          },
          { id: 'program-cs', name: 'Program.cs', type: 'file' },
          { id: 'appsettings', name: 'appsettings.json', type: 'file' },
          { id: 'csproj', name: 'DotnetApp.csproj', type: 'file' }
        ]
      }
    },
    flutter: {
      name: 'Flutter',
      structure: {
        id: 'root',
        name: 'flutter-app',
        type: 'folder',
        children: [
          {
            id: 'lib', name: 'lib', type: 'folder', children: [
              {
                id: 'screens', name: 'screens', type: 'folder', children: [
                  { id: 'home-screen', name: 'home_screen.dart', type: 'file' }
                ]
              },
              {
                id: 'widgets', name: 'widgets', type: 'folder', children: [
                  { id: 'custom-button', name: 'custom_button.dart', type: 'file' }
                ]
              },
              { id: 'main-dart', name: 'main.dart', type: 'file' }
            ]
          },
          {
            id: 'android', name: 'android', type: 'folder', children: [
              {
                id: 'app', name: 'app', type: 'folder', children: [
                  { id: 'build-gradle', name: 'build.gradle', type: 'file' }
                ]
              }
            ]
          },
          {
            id: 'ios', name: 'ios', type: 'folder', children: [
              {
                id: 'runner', name: 'Runner', type: 'folder', children: [
                  { id: 'info-plist', name: 'Info.plist', type: 'file' }
                ]
              }
            ]
          },
          { id: 'pubspec', name: 'pubspec.yaml', type: 'file' }
        ]
      }
    },
    laravel: {
      name: 'Laravel',
      structure: {
        id: 'root',
        name: 'laravel-app',
        type: 'folder',
        children: [
          {
            id: 'app', name: 'app', type: 'folder', children: [
              {
                id: 'http', name: 'Http', type: 'folder', children: [
                  {
                    id: 'controllers', name: 'Controllers', type: 'folder', children: [
                      { id: 'controller', name: 'Controller.php', type: 'file' }
                    ]
                  }
                ]
              },
              {
                id: 'models', name: 'Models', type: 'folder', children: [
                  { id: 'user-php', name: 'User.php', type: 'file' }
                ]
              }
            ]
          },
          {
            id: 'resources', name: 'resources', type: 'folder', children: [
              {
                id: 'views', name: 'views', type: 'folder', children: [
                  { id: 'welcome-blade', name: 'welcome.blade.php', type: 'file' }
                ]
              }
            ]
          },
          {
            id: 'routes', name: 'routes', type: 'folder', children: [
              { id: 'web-php', name: 'web.php', type: 'file' }
            ]
          },
          { id: 'composer-json', name: 'composer.json', type: 'file' },
          { id: 'env', name: '.env', type: 'file' }
        ]
      }
    },
    nextjs: {
      name: 'Next.js',
      structure: {
        id: 'root',
        name: 'nextjs-app',
        type: 'folder',
        children: [
          {
            id: 'app', name: 'app', type: 'folder', children: [
              { id: 'globals-css', name: 'globals.css', type: 'file' },
              { id: 'layout-tsx', name: 'layout.tsx', type: 'file' },
              { id: 'page-tsx', name: 'page.tsx', type: 'file' }
            ]
          },
          {
            id: 'components', name: 'components', type: 'folder', children: [
              { id: 'header', name: 'Header.tsx', type: 'file' }
            ]
          },
          {
            id: 'public', name: 'public', type: 'folder', children: [
              { id: 'next-svg', name: 'next.svg', type: 'file' }
            ]
          },
          { id: 'next-config', name: 'next.config.js', type: 'file' },
          { id: 'package-json', name: 'package.json', type: 'file' }
        ]
      }
    },
    nodejs: {
      name: 'Node.js',
      structure: {
        id: 'root',
        name: 'node-api',
        type: 'folder',
        children: [
          {
            id: 'src', name: 'src', type: 'folder', children: [
              {
                id: 'controllers', name: 'controllers', type: 'folder', children: [
                  { id: 'user-controller', name: 'userController.js', type: 'file' }
                ]
              },
              {
                id: 'routes', name: 'routes', type: 'folder', children: [
                  { id: 'user-routes', name: 'userRoutes.js', type: 'file' }
                ]
              },
              { id: 'app-js', name: 'app.js', type: 'file' }
            ]
          },
          { id: 'package-json', name: 'package.json', type: 'file' },
          { id: 'env', name: '.env', type: 'file' }
        ]
      }
    },
    python: {
      name: 'Python',
      structure: {
        id: 'root',
        name: 'python-project',
        type: 'folder',
        children: [
          {
            id: 'src', name: 'src', type: 'folder', children: [
              { id: 'main-py', name: 'main.py', type: 'file' },
              { id: 'utils-py', name: 'utils.py', type: 'file' }
            ]
          },
          {
            id: 'tests', name: 'tests', type: 'folder', children: [
              { id: 'test-main', name: 'test_main.py', type: 'file' }
            ]
          },
          { id: 'requirements', name: 'requirements.txt', type: 'file' },
          { id: 'readme', name: 'README.md', type: 'file' }
        ]
      }
    },
    react: {
      name: 'React',
      structure: {
        id: 'root',
        name: 'react-app',
        type: 'folder',
        children: [
          {
            id: 'public', name: 'public', type: 'folder', children: [
              { id: 'index-html', name: 'index.html', type: 'file' }
            ]
          },
          {
            id: 'src', name: 'src', type: 'folder', children: [
              { id: 'app-jsx', name: 'App.jsx', type: 'file' },
              { id: 'main-jsx', name: 'main.jsx', type: 'file' },
              { id: 'index-css', name: 'index.css', type: 'file' }
            ]
          },
          { id: 'package', name: 'package.json', type: 'file' },
          { id: 'vite-config', name: 'vite.config.js', type: 'file' }
        ]
      }
    },
    vue: {
      name: 'Vue.js',
      structure: {
        id: 'root',
        name: 'vue-app',
        type: 'folder',
        children: [
          {
            id: 'src', name: 'src', type: 'folder', children: [
              {
                id: 'components', name: 'components', type: 'folder', children: [
                  { id: 'hello-vue', name: 'HelloWorld.vue', type: 'file' }
                ]
              },
              { id: 'app-vue', name: 'App.vue', type: 'file' },
              { id: 'main-js', name: 'main.js', type: 'file' }
            ]
          },
          {
            id: 'public', name: 'public', type: 'folder', children: [
              { id: 'index-html', name: 'index.html', type: 'file' }
            ]
          },
          { id: 'package-json', name: 'package.json', type: 'file' }
        ]
      }
    }
  };

  const loadTemplate = (templateKey) => {
    const template = templates[templateKey].structure;
    // Appliquer le tri au template chargé
    setTree(sortTreeRecursively(template));
    // Réinitialiser les dossiers ouverts : racine + tous les dossiers du template
    const getAllFolderIds = (item) => {
      const ids = [];
      if (item.type === 'folder') {
        ids.push(item.id);
        if (item.children) {
          item.children.forEach(child => {
            ids.push(...getAllFolderIds(child));
          });
        }
      }
      return ids;
    };
    setOpenFolders(new Set(getAllFolderIds(template)));
  };

  // Fonction pour toggle un dossier (ouvert/fermé)
  const toggleFolder = (folderId) => {
    if (folderId === 'root') return; // La racine ne peut pas être fermée
    
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const copyToClipboard = () => {
    const treeText = generateTreeString(tree);
    navigator.clipboard.writeText(treeText);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const findItemById = (items, id) => {
    if (items.id === id) return items;
    if (items.children) {
      for (const child of items.children) {
        const found = findItemById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const addItem = (parentId, type) => {
    const newItem = {
      id: generateId(),
      name: type === 'folder' ? 'nouveau-dossier' : 'nouveau-fichier.txt',
      type,
      children: type === 'folder' ? [] : undefined
    };

    setTree(prevTree => {
      const addToItem = (item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem]
          };
        }
        if (item.children) {
          return {
            ...item,
            children: item.children.map(addToItem)
          };
        }
        return item;
      };
      const updatedTree = addToItem(prevTree);
      // Appliquer le tri automatique après ajout
      return sortTreeRecursively(updatedTree);
    });

    // Si on ajoute un nouveau dossier, l'ouvrir automatiquement
    if (type === 'folder') {
      setOpenFolders(prev => new Set([...prev, newItem.id]));
    }
  };

  const startEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (!editingName.trim()) return;

    setTree(prevTree => {
      const updateItem = (item) => {
        if (item.id === editingId) {
          return { ...item, name: editingName.trim() };
        }
        if (item.children) {
          return {
            ...item,
            children: item.children.map(updateItem)
          };
        }
        return item;
      };
      const updatedTree = updateItem(prevTree);
      // Appliquer le tri automatique après renommage
      return sortTreeRecursively(updatedTree);
    });

    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const removeItem = (itemId) => {
    setTree(prevTree => {
      const removeFromItem = (item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children
              .filter(child => child.id !== itemId) // Supprime l'item ET tout son contenu
              .map(removeFromItem)
          };
        }
        return item;
      };
      return removeFromItem(prevTree);
    });

    // Nettoyer l'état des dossiers ouverts
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const generateTreeString = (item, prefix = '', isLast = true) => {
    const connector = isLast ? '└── ' : '├── ';
    let result = prefix + connector + item.name + '\n';

    if (item.children && item.children.length > 0) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      item.children.forEach((child, index) => {
        const childIsLast = index === item.children.length - 1;
        result += generateTreeString(child, newPrefix, childIsLast);
      });
    }

    return result;
  };

  // Fonction pour détecter le type de fichier par extension
  const getFileTypeFromName = (name) => {
    const extension = name.split('.').pop()?.toLowerCase();

    const typeMap = {
      // JavaScript/TypeScript
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'mjs': 'javascript',
      'cjs': 'javascript',

      // Web
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'css',
      'sass': 'css',
      'less': 'css',

      // Data
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'yaml',

      // Documentation
      'md': 'markdown',
      'markdown': 'markdown',
      'txt': 'text',
      'rtf': 'text',

      // Images
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'gif': 'image',
      'svg': 'image',
      'webp': 'image',
      'ico': 'image',

      // Python
      'py': 'python',
      'pyw': 'python',
      'pyc': 'python',

      // PHP
      'php': 'php',
      'phtml': 'php',

      // Java/C#
      'java': 'java',
      'cs': 'csharp',

      // C/C++
      'c': 'c',
      'cpp': 'cpp',
      'cxx': 'cpp',
      'cc': 'cpp',
      'h': 'c',
      'hpp': 'cpp',

      // Other
      'vue': 'vue',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'sql': 'database'
    };

    return typeMap[extension] || 'file';
  };

  const getIcon = (type, name = '', isOpen = false, onClick = null) => {
    // Pour les dossiers : icône avec couleur #96f2d7
    if (type === 'folder') {
      const FolderIcon = isOpen ? FolderOpen : Folder;
      return (
        <div 
          className={`relative ${onClick ? 'cursor-pointer hover:scale-110 transition-transform duration-150' : ''}`}
          onClick={onClick}
        >
          <FolderIcon className="w-4 h-4" style={{
            color: 'rgb(98, 235, 194)',
            filter: 'drop-shadow(0 0 0.3px rgb(98, 235, 194))'
          }} />
        </div>
      );
    }

    // Pour les fichiers : détecter le type par le nom
    const fileType = getFileTypeFromName(name);

    const iconMap = {
      // JavaScript/TypeScript - Jaune
      'javascript': <File className="w-4 h-4 text-yellow-500" style={{
        filter: 'drop-shadow(0 0 0.2px #eab308)'
      }} />,
      'typescript': <File className="w-4 h-4 text-blue-600" style={{
        filter: 'drop-shadow(0 0 0.2px #2563eb)'
      }} />,

      // Web - HTML Orange, CSS Bleu
      'html': <File className="w-4 h-4 text-orange-500" style={{
        filter: 'drop-shadow(0 0 0.2px #f97316)'
      }} />,
      'css': <File className="w-4 h-4 text-blue-400" style={{
        filter: 'drop-shadow(0 0 0.2px #60a5fa)'
      }} />,

      // Data - JSON Jaune
      'json': <File className="w-4 h-4 text-yellow-600" style={{
        filter: 'drop-shadow(0 0 0.2px #ca8a04)'
      }} />,
      'xml': <File className="w-4 h-4 text-green-400" style={{
        filter: 'drop-shadow(0 0 0.2px #4ade80)'
      }} />,
      'yaml': <File className="w-4 h-4 text-red-500" style={{
        filter: 'drop-shadow(0 0 0.2px #ef4444)'
      }} />,

      // Documentation - Gris
      'markdown': <File className="w-4 h-4 text-gray-700" style={{
        filter: 'drop-shadow(0 0 0.2px #374151)'
      }} />,
      'text': <File className="w-4 h-4 text-gray-500" style={{
        filter: 'drop-shadow(0 0 0.2px #6b7280)'
      }} />,

      // Langages
      'python': <File className="w-4 h-4 text-green-600" style={{
        filter: 'drop-shadow(0 0 0.2px #16a34a)'
      }} />,
      'php': <File className="w-4 h-4 text-purple-600" style={{
        filter: 'drop-shadow(0 0 0.2px #9333ea)'
      }} />,
      'java': <File className="w-4 h-4 text-orange-600" style={{
        filter: 'drop-shadow(0 0 0.2px #ea580c)'
      }} />,
      'csharp': <File className="w-4 h-4 text-purple-700" style={{
        filter: 'drop-shadow(0 0 0.2px #7c3aed)'
      }} />,
      'c': <File className="w-4 h-4 text-blue-800" style={{
        filter: 'drop-shadow(0 0 0.2px #1e40af)'
      }} />,
      'cpp': <File className="w-4 h-4 text-blue-700" style={{
        filter: 'drop-shadow(0 0 0.2px #1d4ed8)'
      }} />,
      'vue': <File className="w-4 h-4 text-green-500" style={{
        filter: 'drop-shadow(0 0 0.2px #22c55e)'
      }} />,
      'ruby': <File className="w-4 h-4 text-red-600" style={{
        filter: 'drop-shadow(0 0 0.2px #dc2626)'
      }} />,
      'go': <File className="w-4 h-4 text-cyan-600" style={{
        filter: 'drop-shadow(0 0 0.2px #0891b2)'
      }} />,
      'rust': <File className="w-4 h-4 text-orange-700" style={{
        filter: 'drop-shadow(0 0 0.2px #c2410c)'
      }} />,
      'shell': <File className="w-4 h-4 text-green-700" style={{
        filter: 'drop-shadow(0 0 0.2px #15803d)'
      }} />,
      'database': <File className="w-4 h-4 text-blue-800" style={{
        filter: 'drop-shadow(0 0 0.2px #1e40af)'
      }} />,

      // Médias
      'image': <File className="w-4 h-4 text-purple-500" style={{
        filter: 'drop-shadow(0 0 0.2px #a855f7)'
      }} />,
      'video': <File className="w-4 h-4 text-red-700" style={{
        filter: 'drop-shadow(0 0 0.2px #b91c1c)'
      }} />,
      'audio': <File className="w-4 h-4 text-green-800" style={{
        filter: 'drop-shadow(0 0 0.2px #166534)'
      }} />,

      // Fichier par défaut
      'file': <File className="w-4 h-4 text-gray-600" style={{
        filter: 'drop-shadow(0 0 0.2px #4b5563)'
      }} />
    };

    return iconMap[fileType] || iconMap.file;
  };

  const TreeItem = ({ item, level = 0 }) => {
    const isEditing = editingId === item.id;
    const isFolder = item.type === 'folder';
    const isOpen = openFolders.has(item.id);
    const canToggle = isFolder && item.id !== 'root';

    return (
      <div className="select-none">
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-50 rounded group transition-colors duration-150"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {/* Icône */}
          <div className="mr-2 flex-shrink-0">
            {getIcon(
              item.type, 
              item.name, 
              isOpen, 
              canToggle ? () => toggleFolder(item.id) : null
            )}
          </div>

          {/* Nom */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                className="w-full px-1 py-0 text-sm border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                autoFocus
              />
            ) : (
              <span
                className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => startEdit(item.id, item.name)}
              >
                {item.name}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {isFolder && (
              <>
                <button
                  onClick={() => addItem(item.id, 'folder')}
                  className="px-2 py-1 hover:bg-blue-100 rounded text-blue-600 transition-colors border border-blue-200 hover:border-blue-300"
                  title="Ajouter un dossier"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => addItem(item.id, 'file')}
                  className="px-2 py-1 hover:bg-green-100 rounded text-green-600 transition-colors border border-green-200 hover:border-green-300"
                  title="Ajouter un fichier"
                >
                  <FilePlus className="w-4 h-4" />
                </button>
              </>
            )}
            {item.id !== 'root' && (
              <button
                onClick={() => removeItem(item.id)}
                className="px-2 py-1 hover:bg-red-100 rounded text-red-500 transition-colors border border-red-200 hover:border-red-300 text-sm font-medium"
                title="Supprimer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Enfants - n'afficher que si le dossier est ouvert */}
        {item.children && isOpen && item.children.map((child) => (
          <TreeItem key={child.id} item={child} level={level + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header unifié */}
      <div className="mb-6 p-6 bg-gray-100 rounded-2xl border border-gray-300">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
              Générateur Arborescence
            </h1>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 font-medium">
                Template :
              </label>
              <select
                onChange={(e) => loadTemplate(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                {Object.entries(templates).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-6 py-2 text-gray-800 font-medium rounded-lg hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ backgroundColor: '#96f2d7' }}
          >
            <span>
              Copier Arborescence
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Vue Interactive */}
        <div className="bg-gray-100 rounded-2xl p-6 border border-gray-300">
          <div className="bg-white rounded-xl border border-gray-300 p-1 min-h-80 overflow-auto">
            <div className="mt-1 ml-1">
              <TreeItem item={tree} />
            </div>
          </div>
        </div>

        {/* Vue ASCII */}
        <div className="bg-gray-100 rounded-2xl p-6 border border-gray-300">
          <div className="bg-gray-900 rounded-xl p-1 min-h-80 overflow-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap ml-1" style={{ color: 'rgb(98, 235, 194)', marginTop: '12px' }}>
              {generateTreeString(tree)}
            </pre>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${showSnackbar
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
        <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Arborescence copiée dans le presse-papier !
        </div>
      </div>
    </div>
  );
};

export default FileTreeBuilder;